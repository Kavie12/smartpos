package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.dto.LoyaltyMemberRequest;
import com.robustedge.smartpos_backend.models.LoyaltyMember;
import com.robustedge.smartpos_backend.chart_pdf_generators.LoyaltyMemberChartGenerator;
import com.robustedge.smartpos_backend.other_pdf_generators.LoyaltyCardGenerator;
import com.robustedge.smartpos_backend.repositories.LoyaltyMemberRepository;
import com.robustedge.smartpos_backend.table_pdf_generators.LoyaltyMemberTableGenerator;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class LoyaltyMemberService {

    @Autowired
    private LoyaltyMemberRepository repository;

    public void addLoyaltyMember(LoyaltyMemberRequest loyaltyMemberRequest) {
        LoyaltyMember loyaltyMember = loyaltyMemberRequest.getLoyaltyMember();
        checkUnique(loyaltyMember.getPhoneNumber());
        validateData(loyaltyMember);
        loyaltyMember.setPoints((double) 0);
        LoyaltyMember savedLoyaltyMember = repository.save(loyaltyMember);

        // Generate loyalty card
        if (loyaltyMemberRequest.isGenerateCard()) {
            generateCard(savedLoyaltyMember.getId());
        }
    }

    private void checkUnique(String phoneNumber) {
        int noOfExistingRecords = repository.NoOfExistingRecords(phoneNumber);
        if (noOfExistingRecords > 0) {
            throw new ApiRequestException("The phone number belongs to a registered loyalty member.");
        }
    }

    private void validateData(LoyaltyMember loyaltyMember) {
        if (loyaltyMember.getFirstName().isEmpty()
                || loyaltyMember.getLastName().isEmpty()
                || loyaltyMember.getPhoneNumber().isEmpty()
        ) {
            throw new ApiRequestException("Please complete all the fields.");
        }
        if (!loyaltyMember.getPhoneNumber().matches("^\\+?[0-9\\s-]{7,20}$")) {
            throw new ApiRequestException("Please enter a valid phone number.");
        }
    }

    public List<LoyaltyMember> getAllLoyaltyMembers() {
        return repository.findAllActiveLoyaltyMembers();
    }

    public PagedModel<LoyaltyMember> getLoyaltyMembers(String searchKey, Pageable pageable) {
        return new PagedModel<>(repository.findFilteredLoyaltyMembers(searchKey, pageable));
    }

    public void updateLoyaltyMember(LoyaltyMember loyaltyMember) {
        validateData(loyaltyMember);
        if (loyaltyMember.getId() == null) {
            return;
        }
        repository.save(loyaltyMember);
    }

    public void deleteLoyaltyMember(Integer id) {
        repository.deleteById(id);
    }

    public LoyaltyMember getOne(Integer id) {
        return repository.findById(id).orElseThrow(() -> new ApiRequestException("Loyalty member not found."));
    }

    public LoyaltyMember getOneByPhoneNumber(String phoneNumber) {
        return repository.findByPhoneNumber(phoneNumber).orElseThrow(() -> new ApiRequestException("Loyalty member not found."));
    }

    public void generateChart() {
        // Fetch loyalty members
        List<LoyaltyMember> loyaltyMembers = repository.findTop5ByPoints();

        // Construct the file name
        String fileName = "chart_" + Utils.getDateTimeFileName() + ".pdf";

        // Generate report
        LoyaltyMemberChartGenerator reportGenerator = new LoyaltyMemberChartGenerator(loyaltyMembers);
        reportGenerator.buildChart(Utils.getReportFolderDirectory("LoyaltyMemberReports", fileName));
    }

    public void generateTableReport() {
        List<LoyaltyMember> loyaltyMembers = getAllLoyaltyMembers();

        String fileName = "table_" + Utils.getDateTimeFileName() + ".pdf";

        LoyaltyMemberTableGenerator pdfGenerator = new LoyaltyMemberTableGenerator(loyaltyMembers);
        pdfGenerator.initialize(Utils.getReportFolderDirectory("LoyaltyMemberReports", fileName));
        pdfGenerator.addMetaData();
        pdfGenerator.addHeading("Loyalty Members");
        pdfGenerator.addTable();
        pdfGenerator.build();
    }

    public void generateCard(Integer id) {
        LoyaltyMember loyaltyMember = getOne(id);
        String fileName = "card_" + loyaltyMember.getPhoneNumber() + ".pdf";
        LoyaltyCardGenerator cardGenerator = new LoyaltyCardGenerator(loyaltyMember, Utils.getReportFolderDirectory("LoyaltyCards", fileName));

        try {
            cardGenerator.initialize()
                    .designCard()
                    .generateCard();

        } catch (IOException e) {
            throw new ApiRequestException("Error generating loyalty card.");
        }

    }
}
