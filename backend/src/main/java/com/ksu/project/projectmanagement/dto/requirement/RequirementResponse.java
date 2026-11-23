package com.ksu.project.projectmanagement.dto.requirement;

public record RequirementResponse(
        Long id,
        String code,
        String title,
        String description,
        String type,
        Long projectId
) {
}
