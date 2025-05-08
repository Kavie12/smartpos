package com.robustedge.smartpos_backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;

@Entity(name = "LoyaltyMember")
@Table(name = "loyalty_members")
@SQLDelete(sql = "UPDATE loyalty_members SET deleted = true WHERE id=?")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoyaltyMember {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @Column(name = "first_name", nullable = false, length = 20)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 20)
    private String lastName;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "points", nullable = false)
    private Double points;

    @Column(name = "deleted", nullable = false)
    private boolean deleted =  false;

    public LoyaltyMember(String firstName, String lastName, String phoneNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
    }

}
