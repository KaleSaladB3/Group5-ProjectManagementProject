package com.ksu.project.projectmanagement.service;

import com.ksu.project.projectmanagement.dto.risk.RiskRequest;
import com.ksu.project.projectmanagement.dto.risk.RiskResponse;
import com.ksu.project.projectmanagement.dto.risk.RiskStatusUpdateRequest;
import com.ksu.project.projectmanagement.model.Project;
import com.ksu.project.projectmanagement.model.Risk;
import com.ksu.project.projectmanagement.repository.ProjectRepository;
import com.ksu.project.projectmanagement.repository.RiskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@Service
public class RiskService {

    private static final Set<String> VALID_STATUSES =
            Set.of("OPEN", "MITIGATED", "CLOSED");

    private final RiskRepository riskRepository;
    private final ProjectRepository projectRepository;

    public RiskService(
            RiskRepository riskRepository,
            ProjectRepository projectRepository
    ) {
        this.riskRepository = riskRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<RiskResponse> getRisks(Long projectId) {
        ensureProjectExists(projectId);

        return riskRepository.findByProjectId(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RiskResponse addRisk(
            Long projectId,
            RiskRequest request
    ) {
        if (request == null
                || request.description() == null
                || request.description().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Risk description is required"
            );
        }

        Project project = findProject(projectId);

        Risk risk = new Risk();
        risk.setDescription(request.description().trim());
        risk.setStatus("OPEN");
        risk.setProject(project);

        return toResponse(riskRepository.save(risk));
    }

    @Transactional
    public RiskResponse editRisk(
            Long projectId,
            Long riskId,
            RiskRequest request
    ) {
        if (request == null
                || request.description() == null
                || request.description().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Risk description is required"
            );
        }

        Risk risk = findRiskForProject(projectId, riskId);
        risk.setDescription(request.description().trim());

        return toResponse(riskRepository.save(risk));
    }

    @Transactional
    public RiskResponse updateRiskStatus(
            Long projectId,
            Long riskId,
            RiskStatusUpdateRequest request
    ) {
        if (request == null
                || request.status() == null
                || request.status().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Risk status is required"
            );
        }

        String status = request.status().trim().toUpperCase();

        if (!VALID_STATUSES.contains(status)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Status must be OPEN, MITIGATED, or CLOSED"
            );
        }

        Risk risk = findRiskForProject(projectId, riskId);
        risk.setStatus(status);

        return toResponse(riskRepository.save(risk));
    }

    @Transactional
    public void deleteRisk(Long projectId, Long riskId) {
        Risk risk = findRiskForProject(projectId, riskId);
        riskRepository.delete(risk);
    }

    private Project findProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Project not found"
                ));
    }

    private void ensureProjectExists(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Project not found"
            );
        }
    }

    private Risk findRiskForProject(
            Long projectId,
            Long riskId
    ) {
        ensureProjectExists(projectId);

        Risk risk = riskRepository.findById(riskId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Risk not found"
                ));

        if (risk.getProject() == null
                || !risk.getProject().getId().equals(projectId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Risk does not belong to this project"
            );
        }

        return risk;
    }

    private RiskResponse toResponse(Risk risk) {
        return new RiskResponse(
                risk.getId(),
                risk.getDescription(),
                risk.getStatus(),
                risk.getProject().getId()
        );
    }
}
