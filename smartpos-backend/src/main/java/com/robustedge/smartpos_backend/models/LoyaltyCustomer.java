package com.robustedge.smartpos_backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class LoyaltyCustomer {

    private @Id @GeneratedValue Integer id;
    private String name;
    private String contactNumber;
    private Integer points;

    public LoyaltyCustomer() {
    }

    public LoyaltyCustomer(Integer id, String name, String contactNumber, Integer points) {
        this.id = id;
        this.name = name;
        this.contactNumber = contactNumber;
        this.points = points;
    }

    public LoyaltyCustomer(String name, String contactNumber) {
        this.name = name;
        this.contactNumber = contactNumber;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    @Override
    public String toString() {
        return "LoyaltyCustomer{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", contactNumber='" + contactNumber + '\'' +
                ", points=" + points +
                '}';
    }
}
