package com.ksu.project.projectmanagement.controller;

import com.ksu.project.projectmanagement.dto.teammember.TeamMemberRequest;
import com.ksu.project.projectmanagement.dto.teammember.TeamMemberResponse;
import com.ksu.project.projectmanagement.service.TeamMemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/team-members")
public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    public TeamMemberController(TeamMemberService teamMemberService) {
        this.teamMemberService = teamMemberService;
    }

    @GetMapping
    public ResponseEntity<List<TeamMemberResponse>> getTeamMembers(
            @PathVariable("projectId") Long projectId
    ) {
        return ResponseEntity.ok(
                teamMemberService.getTeamMembers(projectId)
        );
    }

    @PostMapping
    public ResponseEntity<TeamMemberResponse> addTeamMember(
            @PathVariable("projectId") Long projectId,
            @RequestBody TeamMemberRequest request
    ) {
        TeamMemberResponse createdMember =
                teamMemberService.addTeamMember(projectId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdMember);
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> removeTeamMember(
            @PathVariable("projectId") Long projectId,
            @PathVariable("memberId") Long memberId
    ) {
        teamMemberService.removeTeamMember(projectId, memberId);

        return ResponseEntity.noContent().build();
    }
}
