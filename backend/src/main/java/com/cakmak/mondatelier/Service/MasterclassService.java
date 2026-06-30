package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Model.Masterclass;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.art.ArtCategory;
import com.cakmak.mondatelier.Repository.ArtCategoryRepository;
import com.cakmak.mondatelier.Repository.CityRepository;
import com.cakmak.mondatelier.Repository.MasterclassRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.MasterclassDTO;
import com.cakmak.mondatelier.util.SanitizeInput;
import com.cakmak.mondatelier.util.UploadImage;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class MasterclassService {

    private final MasterclassRepository masterclassRepository;
    private final ArtCategoryRepository artCategoryRepository;
    private final CityRepository cityRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public MasterclassService(
            MasterclassRepository masterclassRepository,
            ArtCategoryRepository artCategoryRepository,
            CityRepository cityRepository) {
        this.masterclassRepository = masterclassRepository;
        this.artCategoryRepository = artCategoryRepository;
        this.cityRepository = cityRepository;
    }

    public List<MasterclassDTO> getMasterclass(String profileId, String masterclassId) {
        List<MasterclassDTO> response = new ArrayList<>();

        if (profileId != null) {
            List<Masterclass> l = masterclassRepository.findByProfile_Id(profileId);
            for (Masterclass m : l) {
                MasterclassDTO dto = DTOMappers.toMasterclassDTO(m);
                response.add(dto);
            }
        } else if (masterclassId != null) {
            Masterclass m = masterclassRepository.findById(masterclassId).orElseThrow(() -> new RuntimeException("cant find"));
            MasterclassDTO dto = DTOMappers.toMasterclassDTO(m);
            response.add(dto);
        }
        return response;
    }

    @Transactional
    public void createMasterclass(
            MasterclassDTO masterClassDTO,
            MultipartFile imageFile,
            Profile owner) {
        ArtCategory artCategory = artCategoryRepository.findByName(masterClassDTO.artCategory())
                .orElseThrow(() -> new IllegalArgumentException("Unknown art category"));

        Masterclass masterclass = new Masterclass();
        masterclass.setProfile(owner);
        masterclass.setTitle(SanitizeInput.sanitize(masterClassDTO.title()));
        masterclass.setDescription(SanitizeInput.sanitize(masterClassDTO.description()));
        masterclass.setSessions(requirePositive(masterClassDTO.sessions(), "Sessions"));
        masterclass.setSessionDuration(requirePositive(
                masterClassDTO.sessionDuration(),
                "Session duration"));
        masterclass.setSessionPrice(requirePositive(masterClassDTO.sessionPrice(), "Session price"));
        masterclass.setArtCategory(artCategory);
        masterclass.setCity(cityRepository.findByName(masterClassDTO.city())
                .orElseThrow(() -> new IllegalArgumentException("Unknown city")));

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UploadImage.upload(imageFile, uploadDir, "masterclasses");
            masterclass.setThumbnailUrl("/masterclasses/" + fileName);
        }

        masterclassRepository.save(masterclass);
    }

    private int requirePositive(Integer value, String field) {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException(field + " must be greater than zero");
        }
        return value;
    }
}
