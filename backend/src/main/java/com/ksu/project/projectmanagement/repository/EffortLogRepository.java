package com.ksu.project.projectmanagement.repository;

import com.ksu.project.projectmanagement.model.EffortLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface EffortLogRepository extends JpaRepository<EffortLog, Long> {

    List<EffortLog> findByRequirementId(Long requirementId);
    List<EffortLog> findByRequirementProjectId(Long projectId);

}
