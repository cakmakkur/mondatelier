package com.cakmak.mondatelier.converter;

import com.cakmak.mondatelier.enums.UserTypes;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class UserTypesConverter implements AttributeConverter<UserTypes, Integer> {

    @Override
    public Integer convertToDatabaseColumn(UserTypes userType) {
        return userType != null ? userType.getValue() : null;
    }

    @Override
    public UserTypes convertToEntityAttribute(Integer dbValue) {
        return dbValue != null ? UserTypes.fromValue(dbValue) : null;
    }
}
