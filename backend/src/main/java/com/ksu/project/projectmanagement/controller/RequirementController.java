package com.ksu.project.projectmanagement.controller;

import com.ksu.project.projectmanagement.dto.requirement.RequirementRequest;
import com.ksu.project.projectmanagement.dto.requirement.RequirementResponse;
import com.ksu.project.projectmanagement.model.Project;
import com.ksu.project.projectmanagement.model.Requirement;
import com.ksu.project.projectmanagement.repository.ProjectRepository;
import com.ksu.project.projectmanagement.repository.RequirementRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/projects/{projectId}/requirements")
public class RequirementController {

    private static final Set<String> VALID_TYPES = Set.of("FUNCTIONAL", "NON_FUNCTIONAL");

    private final ProjectRepository projectRepository;
    private final RequirementRepository requirementRepository;

    public RequirementController(
            ProjectRepository projectRepository,
            RequirementRepository requirementRepository
    ) {
        this.projectRepository = projectRepository;
        this.requirementRepository = requirementRepository;
    }

    @GetMapping
    public List<RequirementResponse> getRequirements(
            @PathVariable("projectId") Long projectId
    ) {
        ensureProjectExists(projectId);
        return requirementRepository.findByProjectId(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    public ResponseEntity<RequirementResponse> createRequirement(
            @PathVariable("projectId") Long projectId,
            @RequestBody RequirementRequest request
    ) {
        Project project = findProject(projectId);
        String type = normalizeType(request);
        String title = request == null || request.title() == null
                ? null : request.title().trim();
        if (title == null || title.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requirement title is required");
        }

        Requirement requirement = new Requirement();
        requirement.setCode(generateCode(projectId, type));
        requirement.setTitle(title);
        requirement.setDescription(request.description());
        requirement.setType(type);
        requirement.setProject(project);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toResponse(requirementRepository.save(requirement)));
    }

    @PutMapping("/{requirementId}")
    public RequirementResponse updateRequirement(
            @PathVariable("projectId") Long projectId,
            @PathVariable("requirementId") Long requirementId,
            @RequestBody RequirementRequest request
    ) {
        Requirement requirement = findRequirement(projectId, requirementId);
        String title = request == null || request.title() == null
                ? null : request.title().trim();
        if (title == null || title.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requirement title is required");
        }

        requirement.setTitle(title);
        requirement.setDescription(request.description());
        requirement.setType(normalizeType(request));
        return toResponse(requirementRepository.save(requirement));
    }

    @DeleteMapping("/{requirementId}")
    public ResponseEntity<Void> deleteRequirement(
            @PathVariable("projectId") Long projectId,
            @PathVariable("requirementId") Long requirementId
    ) {
        Requirement requirement = findRequirement(projectId, requirementId);
        requirementRepository.delete(requirement);
        return ResponseEntity.noContent().build();
    }

    private String normalizeType(RequirementRequest request) {
        if (request == null || request.type() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requirement type is required");
        }
        String type = request.type().trim().toUpperCase().replace('-', '_').replace(' ', '_');
        if (!VALID_TYPES.contains(type)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Requirement type must be FUNCTIONAL or NON_FUNCTIONAL");
        }
        return type;
    }

    private String generateCode(Long projectId, String type) {
        String prefix = "FUNCTIONAL".equals(type) ? "FR" : "NFR";
        long count = requirementRepository.findByProjectId(projectId).stream()
                .filter(requirement -> type.equals(requirement.getType()))
                .count();
        return prefix + "-" + (count + 1);
    }

    private void ensureProjectExists(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }
    }

    private Project findProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    private Requirement findRequirement(Long projectId, Long requirementId) {
        ensureProjectExists(projectId);
        Requirement requirement = requirementRepository.findById(requirementId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Requirement not found"));
        if (!requirement.getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Requirement does not belong to this project");
        }
        return requirement;
    }

    private RequirementResponse toResponse(Requirement requirement) {
        return new RequirementResponse(
                requirement.getId(),
                requirement.getCode(),
                requirement.getTitle(),
                requirement.getDescription(),
                requirement.getType(),
                requirement.getProject().getId()
        );
    }
}
