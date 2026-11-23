package com.ksu.project.projectmanagement.dto.requirement;

public record RequirementRequest(
        String code,
        String title,
        String description,
        String type
) {
}
