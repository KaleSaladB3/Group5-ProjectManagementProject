package com.ksu.project.projectmanagement.dto.effort;

import java.time.LocalDate;

public record EffortLogResponse(
        Long id,
        LocalDate logDate,
        String period,
        String phase,
        Double hours,
        Long requirementId,
        String requirementCode,
        Long teamMemberId
) {
}
