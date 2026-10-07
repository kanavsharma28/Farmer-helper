import React, { createContext, useContext, useState, useEffect } from 'react';

// Default presets for the 4 roles
export const DEFAULT_PRESET_USERS = {
  farmer: {
    id: 'user_farmer_01',
    name: 'Rajesh Kumar',
    nameHi: 'राजेश कुमार',
    initials: 'RK',
    role: 'farmer',
    roleLabelEn: 'Farmer',
    roleLabelHi: 'किसान',
    phone: '9876543210',
    email: 'rajesh.kumar@farmerhelper.in',
    location: 'Meerut, Uttar Pradesh',
    details: {
      landSize: '5 Acres',
      primaryCrop: 'Wheat (गेहूं)',
      membership: 'Premium Member',
    },
  },
  student: {
    id: 'user_student_01',
    name: 'Aman Verma',
    nameHi: 'अमन वर्मा',
    initials: 'AV',
    role: 'student',
    roleLabelEn: 'Student',
    roleLabelHi: 'छात्र',
    phone: '9812345678',
    email: 'aman.verma@agriuni.ac.in',
    location: 'Pantnagar / Meerut',
    details: {
      college: 'GB Pant University of Agriculture',
      course: 'B.Sc Agriculture (Hons)',
      yearOfStudy: '3rd Year',
      areaOfInterest: 'Agri-Tech & Precision Farming',
    },
  },
  buyer: {
    id: 'user_buyer_01',
    name: 'Vikram Sharma',
    businessName: 'Kisan Mandi Agro Traders',
    nameHi: 'विक्रम शर्मा (किसान मंडी ट्रेडर्स)',
    initials: 'VS',
    role: 'buyer',
    roleLabelEn: 'Buyer',
    roleLabelHi: 'खरीदार',
    phone: '9988776655',
    email: 'vikram@kisanmanditraders.com',
    location: 'Khanna Mandi / Meerut',
    details: {
      businessType: 'Wholesale Trader & Processor',
      cropsPurchased: ['Wheat', 'Basmati Rice', 'Soybean'],
      gstNumber: '09AAACK1234M1Z5',
    },
  },
  provider: {
    id: 'user_provider_01',
    name: 'Sardar Gurpreet Singh',
    businessName: 'Krishi Seva Machine Center',
    nameHi: 'सरदार गुरप्रीत सिंह (कृषि सेवा केंद्र)',
    initials: 'GS',
    role: 'provider',
    roleLabelEn: 'Resource Provider',
    roleLabelHi: 'संसाधन प्रदाता',
    phone: '9788665544',
    email: 'gurpreet@krishisevakendra.in',
    location: 'Meerut Rural, UP',
    details: {
      resourceCategory: 'Tractors, Harvesters & Labour',
      totalEquipment: 4,
      availability: 'Immediate Dispatch',
    },
  },
  admin: {
    id: 'user_admin_01',
    name: 'Platform Administrator',
    nameHi: 'प्लेटफॉर्म एडमिनिस्ट्रेटर',
    initials: 'AD',
    role: 'admin',
    roleLabelEn: 'Administrator',
    roleLabelHi: 'व्यवस्थापक',
    phone: '9999900000',
    email: 'admin@farmerhelper.in',
    location: 'Headquarters, New Delhi',
    details: {
      department: 'Platform Operations & Moderation',
      accessLevel: 'Super Administrator',
      status: 'active',
    },
  },
};

const AUTH_STORAGE_KEY = 'farmer_helper_auth_user';
const REGISTERED_USERS_KEY = 'farmer_helper_registered_users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch {
      return null;
    }
  });

  // Keep localStorage in sync when user changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // ignore storage error
    }
  }, [user]);

  // Helper to get initials
  const getInitials = (fullName) => {
    if (!fullName) return 'FH';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper to normalize role
  const normalizeRole = (role) => {
    if (!role) return 'farmer';
    const lower = String(role).toLowerCase().trim();
    if (lower === 'admin' || lower === 'administrator') return 'admin';
    if (lower === 'student') return 'student';
    if (lower === 'buyer') return 'buyer';
    if (
      lower === 'provider' ||
      lower === 'resourceprovider' ||
      lower === 'resource_provider' ||
      lower === 'resource-provider'
    ) {
      return 'provider';
    }
    return 'farmer';
  };

  // Login handler
  const login = ({ identifier, password, role }) => {
    const validRole = normalizeRole(role);

    // If identifier is admin or role is admin
    if (
      validRole === 'admin' ||
      identifier?.toLowerCase() === 'admin@farmerhelper.in' ||
      identifier === '9999900000' ||
      identifier?.toLowerCase() === 'admin'
    ) {
      const adminUser = DEFAULT_PRESET_USERS.admin;
      setUser(adminUser);
      return adminUser;
    }

    // Check if user was previously registered in local storage
    try {
      const registeredStr = localStorage.getItem(REGISTERED_USERS_KEY);
      const registered = registeredStr ? JSON.parse(registeredStr) : [];
      const match = registered.find(
        (u) =>
          u.phone === identifier ||
          u.email?.toLowerCase() === identifier.toLowerCase() ||
          u.identifier === identifier
      );

      if (match) {
        setUser(match);
        return match;
      }
    } catch {
      // ignore
    }

    // If identifier is not in registered list, use preset template for the role
    const preset = DEFAULT_PRESET_USERS[validRole] || DEFAULT_PRESET_USERS.farmer;
    const loggedInUser = {
      ...preset,
      identifier: identifier || preset.phone,
      phone: identifier || preset.phone,
    };

    setUser(loggedInUser);
    return loggedInUser;
  };

  // Quick preset login for demo/testing
  const loginAsPreset = (role) => {
    const validRole = normalizeRole(role);
    const preset = DEFAULT_PRESET_USERS[validRole] || DEFAULT_PRESET_USERS.farmer;
    setUser(preset);
    return preset;
  };

  // Register handler
  const register = (formData, role) => {
    const validRole = normalizeRole(role);
    const name =
      formData.fullName ||
      formData.businessName ||
      formData.contactPerson ||
      (validRole === 'farmer'
        ? 'Farmer User'
        : validRole === 'student'
        ? 'Student User'
        : validRole === 'buyer'
        ? 'Buyer User'
        : 'Provider User');

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      nameHi: name,
      initials: getInitials(name),
      role: validRole,
      roleLabelEn:
        validRole === 'farmer'
          ? 'Farmer'
          : validRole === 'student'
          ? 'Student'
          : validRole === 'buyer'
          ? 'Buyer'
          : 'Resource Provider',
      roleLabelHi:
        validRole === 'farmer'
          ? 'किसान'
          : validRole === 'student'
          ? 'छात्र'
          : validRole === 'buyer'
          ? 'खरीदार'
          : 'संसाधन प्रदाता',
      phone: formData.mobile || formData.phone || '',
      email: formData.email || '',
      location:
        formData.district && formData.state
          ? `${formData.district}, ${formData.state}`
          : formData.location || 'India',
      details: { ...formData },
    };

    // Save to list of registered accounts
    try {
      const existingStr = localStorage.getItem(REGISTERED_USERS_KEY);
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.push(newUser);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existing));
    } catch {
      // ignore
    }

    setUser(newUser);
    return newUser;
  };

  // Logout handler
  const logout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem('farmer_helper_session');
    } catch {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        loginAsPreset,
        register,
        logout,
        normalizeRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
