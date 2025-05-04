package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query("select e from Employee e where :searchKey is null or concat(e.firstName, ' ', e.lastName) like %:searchKey%")
    Page<Employee> findFilteredEmployees(@Param("searchKey") String searchKey, Pageable pageable);

    @Query("select e from Employee e where e.salary > 0 order by e.salary desc limit 5")
    List<Employee> findTop5BySalary();

    @Query("select count(*) from Employee e where e.phoneNumber = :phoneNumber or e.email = :email")
    int NoOfExistingRecords(@Param("phoneNumber") String phoneNumber, @Param("email") String email);

}
