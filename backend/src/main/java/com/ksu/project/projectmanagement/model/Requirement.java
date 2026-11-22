package com.ksu.project.projectmanagement.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "requirements")
@Data
public class Requirement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String type; // "FUNCTIONAL" or "NON_FUNCTIONAL"

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
}