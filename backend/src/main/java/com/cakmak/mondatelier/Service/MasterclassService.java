package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Model.Masterclass;
import com.cakmak.mondatelier.Repository.MasterclassRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.MasterclassDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class MasterclassService {

    private final MasterclassRepository masterclassRepository;

    public MasterclassService(MasterclassRepository masterclassRepository) {
        this.masterclassRepository = masterclassRepository;
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

    public void createMasterclass(MasterclassDTO masterClassDTO, MultipartFile imageFile) {
        // TODO: complete
    }
}
