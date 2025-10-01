
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting foundry database seeding...')

  // Create test user account
  const hashedPassword = await bcrypt.hash('johndoe123', 12)
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'admin'
    }
  })
  console.log('✓ Created test user account')

  // Seed AlloyTypes
  const alloyTypes = await Promise.all([
    prisma.alloyType.upsert({
      where: { id: 'CA-15' },
      update: {},
      create: {
        id: 'CA-15',
        alloyName: 'Cast Austenitic Steel - Standard',
        alloySpecification: 'ASTM A743 Grade CA-15',
        chemicalComposition: {
          Carbon: '0.15%',
          Chromium: '11.5-14%',
          Nickel: '0.5%',
          Manganese: '1.0%',
          Silicon: '1.5%'
        },
        mechanicalProperties: {
          TensileStrength: '70,000 PSI',
          YieldStrength: '30,000 PSI',
          Elongation: '22%',
          Hardness: '217 HB'
        },
        meltingTemperatureRange: '1450-1500°C',
        pouringTemperatureRange: '1480-1520°C',
        qualityStandards: 'ASTM A743, ASME SA-743'
      }
    }),
    prisma.alloyType.upsert({
      where: { id: 'CA-40' },
      update: {},
      create: {
        id: 'CA-40',
        alloyName: 'Cast Austenitic Steel - Higher Carbon',
        alloySpecification: 'ASTM A743 Grade CA-40',
        chemicalComposition: {
          Carbon: '0.40%',
          Chromium: '11.5-14%',
          Nickel: '0.5%',
          Manganese: '1.0%',
          Silicon: '1.5%'
        },
        mechanicalProperties: {
          TensileStrength: '75,000 PSI',
          YieldStrength: '35,000 PSI',
          Elongation: '18%',
          Hardness: '241 HB'
        },
        meltingTemperatureRange: '1450-1500°C',
        pouringTemperatureRange: '1480-1520°C',
        qualityStandards: 'ASTM A743, ASME SA-743'
      }
    }),
    prisma.alloyType.upsert({
      where: { id: 'CA-6NM' },
      update: {},
      create: {
        id: 'CA-6NM',
        alloyName: 'Cast Austenitic Steel - Ni-Mo Enhanced',
        alloySpecification: 'ASTM A743 Grade CA-6NM',
        chemicalComposition: {
          Carbon: '0.06%',
          Chromium: '18-21%',
          Nickel: '8.5-10.5%',
          Molybdenum: '2-3%',
          Manganese: '1.0%',
          Silicon: '1.0%'
        },
        mechanicalProperties: {
          TensileStrength: '80,000 PSI',
          YieldStrength: '40,000 PSI',
          Elongation: '35%',
          Hardness: '217 HB'
        },
        meltingTemperatureRange: '1450-1500°C',
        pouringTemperatureRange: '1480-1520°C',
        qualityStandards: 'ASTM A743, ASME SA-743, NACE MR0175'
      }
    })
  ])
  console.log('✓ Created alloy types')

  // Seed SpinnerEquipment
  const spinnerEquipment = await Promise.all([
    prisma.spinnerEquipment.upsert({
      where: { id: 'SP001' },
      update: {},
      create: {
        id: 'SP001',
        equipmentModel: 'CentrifugalMaster 2000',
        serialNumber: 'CM2000-001',
        installationDate: new Date('2020-03-15'),
        ratedRpmMax: 800,
        ratedCapacityKg: 500.00,
        currentCondition: 'Good',
        lastMajorService: new Date('2024-01-15'),
        serviceIntervalHours: 2000,
        totalOperatingHours: 8500,
        status: 'Active'
      }
    }),
    prisma.spinnerEquipment.upsert({
      where: { id: 'SP002' },
      update: {},
      create: {
        id: 'SP002',
        equipmentModel: 'CentrifugalMaster 2000',
        serialNumber: 'CM2000-002',
        installationDate: new Date('2020-03-20'),
        ratedRpmMax: 800,
        ratedCapacityKg: 500.00,
        currentCondition: 'Fair',
        lastMajorService: new Date('2024-02-10'),
        serviceIntervalHours: 2000,
        totalOperatingHours: 8200,
        status: 'Active'
      }
    }),
    prisma.spinnerEquipment.upsert({
      where: { id: 'SP003' },
      update: {},
      create: {
        id: 'SP003',
        equipmentModel: 'CentrifugalMaster 1500',
        serialNumber: 'CM1500-001',
        installationDate: new Date('2019-11-10'),
        ratedRpmMax: 600,
        ratedCapacityKg: 300.00,
        currentCondition: 'Excellent',
        lastMajorService: new Date('2024-03-01'),
        serviceIntervalHours: 1800,
        totalOperatingHours: 9200,
        status: 'Active'
      }
    })
  ])
  console.log('✓ Created spinner equipment')

  // Seed MoldSpecifications
  const moldSpecs = await Promise.all([
    prisma.moldSpecification.upsert({
      where: { id: 'M001' },
      update: {},
      create: {
        id: 'M001',
        moldType: 'Cylindrical',
        dimensions: {
          length: '12 inches',
          diameter: '6 inches',
          wallThickness: '0.5 inches'
        },
        castingSize: '6x12 inches',
        weightCapacityKg: 25.00,
        material: 'Steel',
        conditionStatus: 'Good',
        lastMaintenanceDate: new Date('2024-06-15'),
        usageCount: 145
      }
    }),
    prisma.moldSpecification.upsert({
      where: { id: 'M002' },
      update: {},
      create: {
        id: 'M002',
        moldType: 'Cylindrical',
        dimensions: {
          length: '16 inches',
          diameter: '8 inches',
          wallThickness: '0.75 inches'
        },
        castingSize: '8x16 inches',
        weightCapacityKg: 45.00,
        material: 'Steel',
        conditionStatus: 'Good',
        lastMaintenanceDate: new Date('2024-07-01'),
        usageCount: 98
      }
    }),
    prisma.moldSpecification.upsert({
      where: { id: 'M003' },
      update: {},
      create: {
        id: 'M003',
        moldType: 'Conical',
        dimensions: {
          length: '20 inches',
          diameter: '10 inches',
          wallThickness: '1.0 inches'
        },
        castingSize: '10x20 inches',
        weightCapacityKg: 75.00,
        material: 'Steel',
        conditionStatus: 'Excellent',
        lastMaintenanceDate: new Date('2024-07-10'),
        usageCount: 67
      }
    })
  ])
  console.log('✓ Created mold specifications')

  // Seed HeatNumbers
  const heatNumbers = await Promise.all([
    prisma.heatNumber.create({
      data: {
        heatNumber: '227',
        alloyId: 'CA-15',
        batchSizeKg: 450.75,
        meltDate: new Date('2024-07-20'),
        meltTime: new Date('2024-07-20T08:30:00Z'),
        furnaceId: 'F001',
        chemicalAnalysis: {
          Carbon: '0.14%',
          Chromium: '12.8%',
          Nickel: '0.4%',
          Manganese: '0.8%',
          Silicon: '1.2%'
        },
        temperatureLog: {
          meltStart: '1465°C',
          meltComplete: '1485°C',
          pourReady: '1495°C'
        },
        qualityCertification: 'QC-2024-227',
        status: 'Approved'
      }
    }),
    prisma.heatNumber.create({
      data: {
        heatNumber: '228',
        alloyId: 'CA-40',
        batchSizeKg: 380.25,
        meltDate: new Date('2024-07-21'),
        meltTime: new Date('2024-07-21T09:15:00Z'),
        furnaceId: 'F002',
        chemicalAnalysis: {
          Carbon: '0.38%',
          Chromium: '13.2%',
          Nickel: '0.5%',
          Manganese: '0.9%',
          Silicon: '1.4%'
        },
        temperatureLog: {
          meltStart: '1470°C',
          meltComplete: '1490°C',
          pourReady: '1500°C'
        },
        qualityCertification: 'QC-2024-228',
        status: 'Approved'
      }
    }),
    prisma.heatNumber.create({
      data: {
        heatNumber: '229',
        alloyId: 'CA-6NM',
        batchSizeKg: 320.50,
        meltDate: new Date('2024-07-22'),
        meltTime: new Date('2024-07-22T10:00:00Z'),
        furnaceId: 'F001',
        chemicalAnalysis: {
          Carbon: '0.05%',
          Chromium: '19.5%',
          Nickel: '9.2%',
          Molybdenum: '2.4%',
          Manganese: '0.8%',
          Silicon: '0.9%'
        },
        temperatureLog: {
          meltStart: '1460°C',
          meltComplete: '1480°C',
          pourReady: '1490°C'
        },
        qualityCertification: 'QC-2024-229',
        status: 'Approved'
      }
    })
  ])
  console.log('✓ Created heat numbers')

  // Seed WorkOrders
  const workOrders = await Promise.all([
    prisma.workOrder.upsert({
      where: { id: '24-07-001' },
      update: {},
      create: {
        id: '24-07-001',
        workOrderNumber: 'WO-2024-001',
        customerId: 1001,
        partSpecification: 'Marine propeller hub - 12" diameter, CA-15 steel',
        quantityOrdered: 5,
        orderDate: new Date('2024-07-15'),
        dueDate: new Date('2024-08-15'),
        priorityLevel: 'High',
        status: 'In Progress'
      }
    }),
    prisma.workOrder.upsert({
      where: { id: '24-07-002' },
      update: {},
      create: {
        id: '24-07-002',
        workOrderNumber: 'WO-2024-002',
        customerId: 1002,
        partSpecification: 'Industrial valve body - 8" pipe connection, CA-40 steel',
        quantityOrdered: 10,
        orderDate: new Date('2024-07-16'),
        dueDate: new Date('2024-08-20'),
        priorityLevel: 'Medium',
        status: 'In Progress'
      }
    }),
    prisma.workOrder.upsert({
      where: { id: '24-07-003' },
      update: {},
      create: {
        id: '24-07-003',
        workOrderNumber: 'WO-2024-003',
        customerId: 1003,
        partSpecification: 'Pump impeller - 10" diameter, CA-6NM steel for marine application',
        quantityOrdered: 3,
        orderDate: new Date('2024-07-17'),
        dueDate: new Date('2024-09-01'),
        priorityLevel: 'Low',
        status: 'Scheduled'
      }
    })
  ])
  console.log('✓ Created work orders')

  // Seed CastingRuns
  const castingRuns = await prisma.castingRun.createMany({
    data: [
      {
        workOrderId: '24-07-001',
        heatId: heatNumbers[0].id,
        moldId: 'M001',
        shiftNumber: 'A',
        operatorId: 'OP001',
        castingDate: new Date('2024-07-20'),
        castingTime: new Date('2024-07-20T10:30:00Z'),
        spinnerId: 'SP001',
        rpmSetting: 650,
        actualRpm: 648,
        pourTemperature: 1495.5,
        ambientTemperature: 22.5,
        castingWeightKg: 23.75,
        cycleTimeMinutes: 45,
        packageInfo: 'Batch A-001',
        operationalGravity: 7.850,
        status: 'Completed',
        notes: 'Good pour, smooth operation'
      },
      {
        workOrderId: '24-07-001',
        heatId: heatNumbers[0].id,
        moldId: 'M001',
        shiftNumber: 'A',
        operatorId: 'OP001',
        castingDate: new Date('2024-07-20'),
        castingTime: new Date('2024-07-20T12:15:00Z'),
        spinnerId: 'SP001',
        rpmSetting: 650,
        actualRpm: 652,
        pourTemperature: 1492.0,
        ambientTemperature: 23.0,
        castingWeightKg: 24.10,
        cycleTimeMinutes: 43,
        packageInfo: 'Batch A-002',
        operationalGravity: 7.845,
        status: 'Completed',
        notes: 'Excellent quality'
      },
      {
        workOrderId: '24-07-002',
        heatId: heatNumbers[1].id,
        moldId: 'M002',
        shiftNumber: 'B',
        operatorId: 'OP002',
        castingDate: new Date('2024-07-21'),
        castingTime: new Date('2024-07-21T14:00:00Z'),
        spinnerId: 'SP002',
        rpmSetting: 700,
        actualRpm: 698,
        pourTemperature: 1500.0,
        ambientTemperature: 24.5,
        castingWeightKg: 42.30,
        cycleTimeMinutes: 50,
        packageInfo: 'Batch B-001',
        operationalGravity: 7.820,
        status: 'Completed',
        notes: 'Minor porosity noted'
      },
      {
        workOrderId: '24-07-003',
        heatId: heatNumbers[2].id,
        moldId: 'M003',
        shiftNumber: 'C',
        operatorId: 'OP003',
        castingDate: new Date('2024-07-22'),
        castingTime: new Date('2024-07-22T16:30:00Z'),
        spinnerId: 'SP003',
        rpmSetting: 550,
        actualRpm: 548,
        pourTemperature: 1490.0,
        ambientTemperature: 25.0,
        castingWeightKg: 68.75,
        cycleTimeMinutes: 60,
        packageInfo: 'Batch C-001',
        operationalGravity: 8.100,
        status: 'Completed',
        notes: 'Perfect casting'
      }
    ]
  })
  console.log('✓ Created casting runs')

  // Get casting run IDs for further seeding
  const createdCastingRuns = await prisma.castingRun.findMany({
    select: { id: true },
    orderBy: { id: 'asc' }
  })

  // Seed QualityInspections
  const qualityInspections = await prisma.qualityInspection.createMany({
    data: [
      {
        castingRunId: createdCastingRuns[0].id,
        inspectionDate: new Date('2024-07-20'),
        inspectionTime: new Date('2024-07-20T15:00:00Z'),
        inspectorId: 'QA001',
        inspectionType: 'Visual & Dimensional',
        overallRating: 1,
        dimensionalCheck: {
          length: 'Within tolerance',
          diameter: 'Within tolerance',
          wallThickness: 'Within tolerance'
        },
        surfaceQualityRating: 1,
        internalQualityRating: 1,
        defectsFound: [],
        correctiveActions: 'None required',
        passFailStatus: 'Pass',
        certificationLevel: 'Level 1',
        notes: 'Excellent quality casting'
      },
      {
        castingRunId: createdCastingRuns[1].id,
        inspectionDate: new Date('2024-07-20'),
        inspectionTime: new Date('2024-07-20T16:30:00Z'),
        inspectorId: 'QA001',
        inspectionType: 'Visual & Dimensional',
        overallRating: 1,
        dimensionalCheck: {
          length: 'Within tolerance',
          diameter: 'Within tolerance',
          wallThickness: 'Within tolerance'
        },
        surfaceQualityRating: 1,
        internalQualityRating: 1,
        defectsFound: [],
        correctiveActions: 'None required',
        passFailStatus: 'Pass',
        certificationLevel: 'Level 1',
        notes: 'Superior finish quality'
      },
      {
        castingRunId: createdCastingRuns[2].id,
        inspectionDate: new Date('2024-07-21'),
        inspectionTime: new Date('2024-07-21T17:00:00Z'),
        inspectorId: 'QA002',
        inspectionType: 'Visual & NDT',
        overallRating: 2,
        dimensionalCheck: {
          length: 'Within tolerance',
          diameter: 'Within tolerance',
          wallThickness: 'Slightly under'
        },
        surfaceQualityRating: 2,
        internalQualityRating: 2,
        defectsFound: [
          {
            type: 'Minor porosity',
            location: 'Internal wall',
            severity: 'Low'
          }
        ],
        correctiveActions: 'Monitor temperature control',
        passFailStatus: 'Pass',
        certificationLevel: 'Level 2',
        notes: 'Acceptable with minor defects'
      },
      {
        castingRunId: createdCastingRuns[3].id,
        inspectionDate: new Date('2024-07-22'),
        inspectionTime: new Date('2024-07-22T18:00:00Z'),
        inspectorId: 'QA003',
        inspectionType: 'Full Inspection',
        overallRating: 1,
        dimensionalCheck: {
          length: 'Perfect',
          diameter: 'Perfect',
          wallThickness: 'Perfect'
        },
        surfaceQualityRating: 1,
        internalQualityRating: 1,
        defectsFound: [],
        correctiveActions: 'None required',
        passFailStatus: 'Pass',
        certificationLevel: 'Level 1',
        notes: 'Outstanding quality - reference standard'
      }
    ]
  })
  console.log('✓ Created quality inspections')

  // Get inspection IDs for defect records
  const createdInspections = await prisma.qualityInspection.findMany({
    select: { id: true, castingRunId: true },
    orderBy: { id: 'asc' }
  })

  // Seed DefectRecord for the one casting with issues
  await prisma.defectRecord.create({
    data: {
      inspectionId: createdInspections[2].id,
      castingRunId: createdInspections[2].castingRunId,
      defectType: 'Porosity',
      defectSeverity: 'Minor',
      defectLocation: 'Internal wall section',
      defectDescription: 'Small scattered porosity detected during ultrasonic testing',
      probableCause: 'Slightly low pouring temperature caused incomplete fill',
      correctiveAction: 'Increased pour temperature by 5°C for subsequent castings',
      preventionMeasures: 'Enhanced temperature monitoring and control procedures',
      costImpact: 25.50,
      resolutionDate: new Date('2024-07-22'),
      status: 'Resolved'
    }
  })
  console.log('✓ Created defect record')

  // Seed MaintenanceRecords
  await prisma.maintenanceRecord.createMany({
    data: [
      {
        spinnerId: 'SP001',
        maintenanceDate: new Date('2024-07-15'),
        maintenanceType: 'Routine Inspection',
        technicianId: 'TECH001',
        currentRpm: 650,
        targetRpm: 650,
        vibrationLevel: 2.1,
        temperatureReading: 45.5,
        maintenancePerformed: 'Visual inspection, lubrication check, belt tension adjustment',
        partsReplaced: [],
        cost: 125.00,
        nextServiceDate: new Date('2024-10-15'),
        conditionAfterService: 'Good',
        notes: 'All systems operating within normal parameters'
      },
      {
        spinnerId: 'SP002',
        maintenanceDate: new Date('2024-07-10'),
        maintenanceType: 'Bearing Replacement',
        technicianId: 'TECH002',
        currentRpm: 700,
        targetRpm: 700,
        vibrationLevel: 1.8,
        temperatureReading: 42.0,
        maintenancePerformed: 'Replaced main shaft bearings, realigned drive system',
        partsReplaced: [
          {
            part: 'Main bearing set',
            partNumber: 'BRG-2000-MS',
            quantity: 1
          }
        ],
        cost: 850.00,
        nextServiceDate: new Date('2024-11-10'),
        conditionAfterService: 'Excellent',
        notes: 'Vibration reduced significantly after bearing replacement'
      },
      {
        spinnerId: 'SP003',
        maintenanceDate: new Date('2024-07-05'),
        maintenanceType: 'Preventive Maintenance',
        technicianId: 'TECH001',
        currentRpm: 550,
        targetRpm: 550,
        vibrationLevel: 1.5,
        temperatureReading: 38.5,
        maintenancePerformed: 'Complete lubrication service, filter replacement, safety system check',
        partsReplaced: [
          {
            part: 'Oil filter',
            partNumber: 'FLT-1500-OIL',
            quantity: 2
          }
        ],
        cost: 200.00,
        nextServiceDate: new Date('2024-12-05'),
        conditionAfterService: 'Excellent',
        notes: 'Equipment in excellent condition, no issues found'
      }
    ]
  })
  console.log('✓ Created maintenance records')

  // Seed ProcessParameters
  await prisma.processParameter.createMany({
    data: [
      {
        castingRunId: createdCastingRuns[0].id,
        parameterType: 'RPM',
        measurementTime: new Date('2024-07-20T10:35:00Z'),
        parameterValue: 648,
        parameterUnit: 'RPM',
        targetValue: 650,
        toleranceRange: '±5',
        withinSpecification: true,
        measurementDevice: 'Digital Tachometer DT-2000',
        operatorId: 'OP001'
      },
      {
        castingRunId: createdCastingRuns[0].id,
        parameterType: 'Temperature',
        measurementTime: new Date('2024-07-20T10:32:00Z'),
        parameterValue: 1495.5,
        parameterUnit: '°C',
        targetValue: 1495,
        toleranceRange: '±10',
        withinSpecification: true,
        measurementDevice: 'Pyrometer PY-1000',
        operatorId: 'OP001'
      },
      {
        castingRunId: createdCastingRuns[1].id,
        parameterType: 'RPM',
        measurementTime: new Date('2024-07-20T12:20:00Z'),
        parameterValue: 652,
        parameterUnit: 'RPM',
        targetValue: 650,
        toleranceRange: '±5',
        withinSpecification: true,
        measurementDevice: 'Digital Tachometer DT-2000',
        operatorId: 'OP001'
      },
      {
        castingRunId: createdCastingRuns[2].id,
        parameterType: 'Temperature',
        measurementTime: new Date('2024-07-21T14:05:00Z'),
        parameterValue: 1500.0,
        parameterUnit: '°C',
        targetValue: 1500,
        toleranceRange: '±10',
        withinSpecification: true,
        measurementDevice: 'Pyrometer PY-1000',
        operatorId: 'OP002'
      }
    ]
  })
  console.log('✓ Created process parameters')

  console.log('🎉 Foundry database seeding completed successfully!')
  console.log('Test account: john@doe.com / johndoe123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
