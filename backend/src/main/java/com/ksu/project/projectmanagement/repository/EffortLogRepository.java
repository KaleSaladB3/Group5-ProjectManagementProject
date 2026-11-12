package com.ksu.project.projectmanagement.repository;

import com.ksu.project.projectmanagement.model.EffortLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EffortLogRepository extends JpaRepository<EffortLog, Long> {
}
