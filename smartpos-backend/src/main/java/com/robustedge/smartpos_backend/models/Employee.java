package com.robustedge.smartpos_backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "Employee")
@Table(name = "employees")
@Data
@NoArgsConstructor
public class Employee {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @Column(name = "first_name", nullable = false, length = 20)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 20)
    private String lastName;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "salary", nullable = false)
    private double salary;

    public Employee(String firstName, String lastName, String phoneNumber, String email, int salary) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.salary = salary;
    }

}
