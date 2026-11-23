package com.ksu.project.projectmanagement.controller;

import com.ksu.project.projectmanagement.dto.effort.EffortLogRequest;
import com.ksu.project.projectmanagement.dto.effort.EffortLogResponse;
import com.ksu.project.projectmanagement.model.EffortLog;
import com.ksu.project.projectmanagement.model.Requirement;
import com.ksu.project.projectmanagement.model.TeamMember;
import com.ksu.project.projectmanagement.repository.EffortLogRepository;
import com.ksu.project.projectmanagement.repository.RequirementRepository;
import com.ksu.project.projectmanagement.repository.TeamMemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/projects/{projectId}/effort-logs")
public class EffortLogController {

    private static final Set<String> VALID_PHASES = Set.of(
            "REQUIREMENTS_ANALYSIS", "DESIGN", "DESIGNING", "CODING",
            "TESTING", "PROJECT_MANAGEMENT"
    );

    private final EffortLogRepository effortLogRepository;
    private final RequirementRepository requirementRepository;
    private final TeamMemberRepository teamMemberRepository;

    public EffortLogController(
            EffortLogRepository effortLogRepository,
            RequirementRepository requirementRepository,
            TeamMemberRepository teamMemberRepository
    ) {
        this.effortLogRepository = effortLogRepository;
        this.requirementRepository = requirementRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    @GetMapping
    public List<EffortLogResponse> getEffortLogs(
            @PathVariable("projectId") Long projectId
    ) {
        return effortLogRepository.findByRequirementProjectId(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    public ResponseEntity<EffortLogResponse> createEffortLog(
            @PathVariable("projectId") Long projectId,
            @RequestBody EffortLogRequest request
    ) {
        EffortLog effortLog = new EffortLog();
        applyRequest(projectId, effortLog, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toResponse(effortLogRepository.save(effortLog)));
    }

    @PutMapping("/{effortLogId}")
    public EffortLogResponse updateEffortLog(
            @PathVariable("projectId") Long projectId,
            @PathVariable("effortLogId") Long effortLogId,
            @RequestBody EffortLogRequest request
    ) {
        EffortLog effortLog = effortLogRepository.findById(effortLogId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Effort log not found"));
        if (!effortLog.getRequirement().getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Effort log does not belong to this project");
        }
        applyRequest(projectId, effortLog, request);
        return toResponse(effortLogRepository.save(effortLog));
    }

    @DeleteMapping("/{effortLogId}")
    public ResponseEntity<Void> deleteEffortLog(
            @PathVariable("projectId") Long projectId,
            @PathVariable("effortLogId") Long effortLogId
    ) {
        EffortLog effortLog = effortLogRepository.findById(effortLogId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Effort log not found"));
        if (!effortLog.getRequirement().getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Effort log does not belong to this project");
        }
        effortLogRepository.delete(effortLog);
        return ResponseEntity.noContent().build();
    }

    private void applyRequest(Long projectId, EffortLog effortLog, EffortLogRequest request) {
        if (request == null || request.logDate() == null || request.phase() == null
                || request.hours() == null || request.requirementId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Date, phase, hours, and requirement are required");
        }
        if (request.hours() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hours must be greater than 0");
        }

        Requirement requirement = requirementRepository.findById(request.requirementId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Requirement not found"));
        if (!requirement.getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Requirement does not belong to this project");
        }

        String period = request.period() == null ? "DAILY"
                : request.period().trim().toUpperCase();
        if (!period.equals("DAILY") && !period.equals("WEEKLY")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Period must be DAILY or WEEKLY");
        }
        double limit = period.equals("WEEKLY") ? 168 : 24;
        if (request.hours() > limit) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Hours exceed the " + period.toLowerCase() + " limit");
        }

        String phase = request.phase().trim().toUpperCase()
                .replace('-', '_').replace(' ', '_');
        if (!VALID_PHASES.contains(phase)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid effort phase");
        }
        if (phase.equals("DESIGN")) phase = "DESIGNING";

        TeamMember teamMember = null;
        if (request.teamMemberId() != null) {
            teamMember = teamMemberRepository.findById(request.teamMemberId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team member not found"));
            if (!teamMember.getProject().getId().equals(projectId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Team member does not belong to this project");
            }
        }

        effortLog.setLogDate(request.logDate());
        effortLog.setPeriod(period);
        effortLog.setPhase(phase);
        effortLog.setHours(request.hours());
        effortLog.setRequirement(requirement);
        effortLog.setTeamMember(teamMember);
    }

    private EffortLogResponse toResponse(EffortLog effortLog) {
        return new EffortLogResponse(
                effortLog.getId(),
                effortLog.getLogDate(),
                effortLog.getPeriod(),
                effortLog.getPhase(),
                effortLog.getHours(),
                effortLog.getRequirement().getId(),
                effortLog.getRequirement().getCode(),
                effortLog.getTeamMember() == null ? null : effortLog.getTeamMember().getId()
        );
    }
}
