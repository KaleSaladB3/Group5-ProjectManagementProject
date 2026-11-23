package com.ksu.project.projectmanagement.dto.teammember;

public record TeamMemberResponse(
        Long id,
        String name,
        String role,
        boolean active,
        Long projectId
) {
}
