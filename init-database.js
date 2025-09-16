const { sequelize, Patient, Doctor, Appointment, Service, MedicalAid } = require('./models');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Sync all models (create tables)
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ All tables created/updated successfully');

    // Create default services
    const defaultServices = [
      {
        name: 'Comprehensive Eye Examination',
        description: 'Full vision assessment, refraction, ocular health screening, and diagnosis of eye conditions.',
        duration: 45,
        price: 350.00,
        category: 'examination'
      },
      {
        name: 'Contact Lens Fitting',
        description: 'Professional contact lens fitting and management.',
        duration: 30,
        price: 250.00,
        category: 'contact_lens'
      },
      {
        name: 'Emergency Eye Care',
        description: 'Urgent eye care for eye injuries and emergencies.',
        duration: 20,
        price: 400.00,
        category: 'emergency'
      },
      {
        name: 'Follow-up Consultation',
        description: 'Follow-up appointment for ongoing treatment.',
        duration: 15,
        price: 150.00,
        category: 'follow_up'
      }
    ];

    for (const service of defaultServices) {
      await Service.findOrCreate({
        where: { name: service.name },
        defaults: service
      });
    }
    console.log('✅ Default services created');

    // Create default insurance providers
    const defaultInsurance = [
      {
        name: 'Discovery Health',
        contactNumber: '0860 99 88 77',
        email: 'info@discovery.co.za',
        website: 'https://www.discovery.co.za'
      },
      {
        name: 'Bonitas Medical Fund',
        contactNumber: '0860 002 660',
        email: 'info@bonitas.co.za',
        website: 'https://www.bonitas.co.za'
      },
      {
        name: 'Momentum Health',
        contactNumber: '0860 11 78 59',
        email: 'info@momentum.co.za',
        website: 'https://www.momentum.co.za'
      },
      {
        name: 'Medihelp',
        contactNumber: '0860 633 443',
        email: 'info@medihelp.co.za',
        website: 'https://www.medihelp.co.za'
      }
    ];

    for (const medicalAid of defaultInsurance) {
      await MedicalAid.findOrCreate({
        where: { name: medicalAid.name },
        defaults: medicalAid
      });
    }
    console.log('✅ Default medical aid providers created');

    // Create default doctor (NB Maswanganyi)
    const defaultDoctor = {
      firstName: 'NB',
      lastName: 'Maswanganyi',
      email: 'nb.maswanganyi@maswanganyioptom.co.za',
      phone: '+27 63 824 4393',
      licenseNumber: 'OPT-2024-001',
      specializations: 'General Optometry, Contact Lens Specialist',
      education: 'Bachelor of Optometry - University of KwaZulu-Natal (2020)',
      experience: '4 years experience as Junior Optometrist at Vision Care Centre',
      bio: 'NB Maswanganyi is a qualified optometrist with extensive experience in comprehensive eye examinations, contact lens fitting, and the treatment of various eye conditions. Committed to providing personalized eye care to the Midrand community.',
      profileImage: '/images/SitsiPhoto.jpg',
      workingHours: 'Monday-Friday: 08:00-18:00, Saturday: 09:00-15:00, Sunday: Closed'
    };

    await Doctor.findOrCreate({
      where: { email: defaultDoctor.email },
      defaults: defaultDoctor
    });
    console.log('✅ Default doctor created');

    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
};

// Run initialization
initializeDatabase()
  .then(() => {
    console.log('✅ Database is ready for use!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database initialization failed:', error);
    process.exit(1);
  });
