package com.ksu.project.projectmanagement.dto.effort;

import java.time.LocalDate;

public record EffortLogRequest(
        LocalDate logDate,
        String period,
        String phase,
        Double hours,
        Long requirementId,
        Long teamMemberId
) {
}
