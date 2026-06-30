package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Model.Freelance;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.art.ArtCategory;
import com.cakmak.mondatelier.Repository.ArtCategoryRepository;
import com.cakmak.mondatelier.Repository.FreelanceRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.FreelanceDTO;
import com.cakmak.mondatelier.util.SanitizeInput;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FreelanceService {

    private final FreelanceRepository freelanceRepository;
    private final ArtCategoryRepository artCategoryRepository;

    public FreelanceService(
            FreelanceRepository freelanceRepository,
            ArtCategoryRepository artCategoryRepository) {
        this.freelanceRepository = freelanceRepository;
        this.artCategoryRepository = artCategoryRepository;
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

    @Transactional
    public void createFreelance(FreelanceDTO freelanceDTO, Profile owner) {
        ArtCategory category = artCategoryRepository.findByName(freelanceDTO.artCategory())
                .orElseThrow(() -> new IllegalArgumentException("Unknown art category"));

        Freelance freelance = new Freelance();
        freelance.setProfile(owner);
        freelance.setArtCategory(category);
        freelance.setDescription(SanitizeInput.sanitize(freelanceDTO.description()));
        freelanceRepository.save(freelance);
    }

}
