package com.ksu.project.projectmanagement.repository;

import com.ksu.project.projectmanagement.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    List<TeamMember> findByProjectId(Long projectId);

}
