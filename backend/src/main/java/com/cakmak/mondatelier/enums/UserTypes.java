package com.cakmak.mondatelier.enums;

public enum UserTypes {
    PERSONAL(1),
    COLLECTIVE(2),
    BUSINESS(3);

    private final int value;

    UserTypes(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static UserTypes fromValue(int value) {
        for (UserTypes type : UserTypes.values()) {
            if (type.getValue() == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid value: " + value);
    }
}
