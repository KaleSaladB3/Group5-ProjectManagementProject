package com.ksu.project.projectmanagement.controller;

import com.ksu.project.projectmanagement.dto.risk.RiskRequest;
import com.ksu.project.projectmanagement.dto.risk.RiskResponse;
import com.ksu.project.projectmanagement.dto.risk.RiskStatusUpdateRequest;
import com.ksu.project.projectmanagement.service.RiskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/risks")
public class RiskController {

    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    @GetMapping
    public ResponseEntity<List<RiskResponse>> getRisks(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(
                riskService.getRisks(projectId)
        );
    }

    @PostMapping
    public ResponseEntity<RiskResponse> addRisk(
            @PathVariable Long projectId,
            @RequestBody RiskRequest request
    ) {
        RiskResponse createdRisk =
                riskService.addRisk(projectId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdRisk);
    }

    @PutMapping("/{riskId}")
    public ResponseEntity<RiskResponse> editRisk(
            @PathVariable Long projectId,
            @PathVariable Long riskId,
            @RequestBody RiskRequest request
    ) {
        return ResponseEntity.ok(
                riskService.editRisk(projectId, riskId, request)
        );
    }

    @PatchMapping("/{riskId}/status")
    public ResponseEntity<RiskResponse> updateRiskStatus(
            @PathVariable Long projectId,
            @PathVariable Long riskId,
            @RequestBody RiskStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(
                riskService.updateRiskStatus(
                        projectId,
                        riskId,
                        request
                )
        );
    }

    @DeleteMapping("/{riskId}")
    public ResponseEntity<Void> deleteRisk(
            @PathVariable Long projectId,
            @PathVariable Long riskId
    ) {
        riskService.deleteRisk(projectId, riskId);

        return ResponseEntity.noContent().build();
    }
}
