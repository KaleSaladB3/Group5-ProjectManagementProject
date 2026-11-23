package com.ksu.project.projectmanagement.dto.risk;

public record RiskResponse(
        Long id,
        String description,
        String status,
        Long projectId
) {
}
