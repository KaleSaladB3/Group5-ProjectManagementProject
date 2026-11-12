package com.ksu.project.projectmanagement.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "effort_logs")
@Data
public class EffortLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate logDate; // Supports daily or weekly entries

    @Column(nullable = false)
    private String phase;// "REQUIREMENTS_ANALYSIS", "DESIGNING", "CODING", "TESTING", or "PROJECT_MANAGEMENT"

    @Column(nullable = false)
    private Double hours;

    @ManyToOne
    @JoinColumn(name = "requirement_id", nullable = false)
    private Requirement requirement;

    @ManyToOne
    @JoinColumn(name = "team_member_id")
    private TeamMember teamMember;
}