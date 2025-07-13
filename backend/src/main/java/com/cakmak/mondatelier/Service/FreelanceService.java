package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Model.Freelance;
import com.cakmak.mondatelier.Repository.FreelanceRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.FreelanceDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FreelanceService {

    private final FreelanceRepository freelanceRepository;

    public FreelanceService(FreelanceRepository freelanceRepository) {
        this.freelanceRepository = freelanceRepository;
    }

    public List<FreelanceDTO> getFreelance(String profileId, String freelanceId) {

        List<FreelanceDTO> response = new ArrayList<>();

        if (freelanceId != null) {
            Freelance freelance = freelanceRepository.findById(freelanceId).orElseThrow(RuntimeException::new);
            FreelanceDTO dto = DTOMappers.toFreelanceDTO(freelance);
            response.add(dto);
        } else if (profileId != null) {
            List<Freelance> list = freelanceRepository.findByProfile_Id(profileId);
            for (Freelance f : list) {
                FreelanceDTO dto = DTOMappers.toFreelanceDTO(f);
                response.add(dto);
            }
        }
        return response;
    }

}
