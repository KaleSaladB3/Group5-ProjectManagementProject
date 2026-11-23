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
    private LocalDate logDate;

    @Column(nullable = false)
    private String phase;

    @Column(nullable = false)
    private Double hours;

    @Column(nullable = false)
    private String period = "DAILY";

    @ManyToOne
    @JoinColumn(name = "requirement_id", nullable = false)
    private Requirement requirement;

    @ManyToOne
    @JoinColumn(name = "team_member_id")
    private TeamMember teamMember;
}