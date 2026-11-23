package com.ksu.project.projectmanagement.service;

import com.ksu.project.projectmanagement.dto.teammember.TeamMemberRequest;
import com.ksu.project.projectmanagement.dto.teammember.TeamMemberResponse;
import com.ksu.project.projectmanagement.model.Project;
import com.ksu.project.projectmanagement.model.TeamMember;
import com.ksu.project.projectmanagement.repository.ProjectRepository;
import com.ksu.project.projectmanagement.repository.TeamMemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;
    private final ProjectRepository projectRepository;

    public TeamMemberService(
            TeamMemberRepository teamMemberRepository,
            ProjectRepository projectRepository
    ) {
        this.teamMemberRepository = teamMemberRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getTeamMembers(Long projectId) {
        ensureProjectExists(projectId);

        return teamMemberRepository.findByProjectId(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TeamMemberResponse addTeamMember(
            Long projectId,
            TeamMemberRequest request
    ) {
        if (request == null || request.name() == null
                || request.name().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Team member name is required"
            );
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Project not found"
                ));

        TeamMember teamMember = new TeamMember();
        teamMember.setName(request.name().trim());

        String role = request.role();
        teamMember.setRole(
                role == null || role.isBlank()
                        ? null
                        : role.trim()
        );

        teamMember.setActive(true);
        teamMember.setProject(project);

        TeamMember savedMember = teamMemberRepository.save(teamMember);

        return toResponse(savedMember);
    }

    @Transactional
    public void removeTeamMember(Long projectId, Long memberId) {
        ensureProjectExists(projectId);

        TeamMember teamMember = teamMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Team member not found"
                ));

        if (teamMember.getProject() == null
                || !teamMember.getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Team member does not belong to this project"
            );
        }

        teamMemberRepository.delete(teamMember);
    }

    private void ensureProjectExists(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Project not found"
            );
        }
    }

    private TeamMemberResponse toResponse(TeamMember teamMember) {
        return new TeamMemberResponse(
                teamMember.getId(),
                teamMember.getName(),
                teamMember.getRole(),
                teamMember.isActive(),
                teamMember.getProject().getId()
        );
    }
}
