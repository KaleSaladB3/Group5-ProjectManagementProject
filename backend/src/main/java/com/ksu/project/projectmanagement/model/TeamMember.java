package com.ksu.project.projectmanagement.model;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "team_members")
@Data
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String role;

    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

}
