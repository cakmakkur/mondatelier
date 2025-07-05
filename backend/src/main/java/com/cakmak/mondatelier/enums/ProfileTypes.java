package com.cakmak.mondatelier.enums;

public enum ProfileTypes {
    FREEMIUM(1),
    PREMIUM(2),
    PLATINUM(3);

    private final int value;

    ProfileTypes(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static ProfileTypes fromValue(int value) {
        for (ProfileTypes type : ProfileTypes.values()) {
            if (type.getValue() == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid value: " + value);
    }
}
