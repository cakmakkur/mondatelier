package com.cakmak.mondatelier.converter;

import com.cakmak.mondatelier.enums.ProfileTypes;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ProfileTypesConverter implements AttributeConverter<ProfileTypes, Integer> {

    @Override
    public Integer convertToDatabaseColumn(ProfileTypes attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public ProfileTypes convertToEntityAttribute(Integer dbData) {
        if (dbData == null) {
            return null;
        }
        return ProfileTypes.fromValue(dbData);
    }
}