package com.ksu.project.projectmanagement.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "risks")
@Data
public class Risk {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String status; // "OPEN", "MITIGATED", "CLOSED"

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

}
