package com.robustedge.smartpos_backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;

@Entity(name = "Supplier")
@Table(name = "suppliers")
@SQLDelete(sql = "UPDATE suppliers SET deleted = true WHERE id=?")
@Data
@NoArgsConstructor
public class Supplier {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "email", nullable = false, unique = true, length = 50)
    private String email;

    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;

    public Supplier(String name, String phoneNumber, String email) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

}
