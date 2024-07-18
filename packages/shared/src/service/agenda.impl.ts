import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  FindAllAgendaOptions,
  InsertAgenda,
  AgendaRepository,
  SelectAgenda,
  UpdateAgenda,
  InsertAgendaBooking,
  UpdateAgendaBooking,
  FindScheduleByDateOptions,
  FindAgendaByUserOptions,
  UserRepository,
  ClassRepository,
  PackageRepository,
  CreditRepository,
  InsertAgendaAndTransaction,
  LocationRepository,
  FindAllAgendaByCoachOptions,
  SelectCoach,
  UpdateAgendaBookingById,
} from '../repository';
import { AgendaService } from './agenda';
import { addMinutes, isAfter, isBefore, isEqual } from 'date-fns';
import { NotificationType, type NotificationService } from '../notification';

@injectable()
export class AgendaServiceImpl implements AgendaService {
  private _agendaRepository: AgendaRepository;
  private _userRepository: UserRepository;
  private _classRepository: ClassRepository;
  private _packageRepository: PackageRepository;
  private _creditRepository: CreditRepository;
  private _notificationService: NotificationService;
  private _locationRepository: LocationRepository;

  constructor(
    @inject(TYPES.AgendaRepository) agendaRepository: AgendaRepository,
    @inject(TYPES.UserRepository) userRepository: UserRepository,
    @inject(TYPES.ClassRepository) classRepository: ClassRepository,
    @inject(TYPES.PackageRepository) packageRepository: PackageRepository,
    @inject(TYPES.CreditRepository) creditRepository: CreditRepository,
    @inject(TYPES.NotificationService) notificationService: NotificationService,
    @inject(TYPES.LocationRepository) locationRepository: LocationRepository
  ) {
    this._agendaRepository = agendaRepository;
    this._userRepository = userRepository;
    this._classRepository = classRepository;
    this._packageRepository = packageRepository;
    this._creditRepository = creditRepository;
    this._notificationService = notificationService;
    this._locationRepository = locationRepository;
  }

  async count() {
    return this._agendaRepository.count();
  }

  async countParticipant(id: SelectAgenda['id']) {
    return this._agendaRepository.countParticipant(id);
  }

  async countCheckedInByUserId(userId: SelectAgenda['id']) {
    return this._agendaRepository.countCheckedInByUserId(userId);
  }

  async countCoachAgenda(userId: SelectCoach['user_id']) {
    return this._agendaRepository.countCoachAgenda(userId);
  }

  async findAll(data: FindAllAgendaOptions) {
    const agendas = await this._agendaRepository.findAll(data);

    return {
      result: agendas,
      error: undefined,
    };
  }

  async findById(id: SelectAgenda['id']) {
    const singleAgenda = await this._agendaRepository.findById(id);

    if (!singleAgenda) {
      return {
        error: new Error('Agenda not found'),
      };
    }

    return {
      result: singleAgenda,
    };
  }

  async findAllParticipantByAgendaId(id: SelectAgenda['id']) {
    const participants =
      await this._agendaRepository.findAllParticipantByAgendaId(id);

    return {
      result: participants,
      error: undefined,
    };
  }

  async findTodayScheduleByCoachId(coachUserId: SelectCoach['user_id']) {
    const schedules =
      await this._agendaRepository.findTodayScheduleByCoachId(coachUserId);

    return {
      result: schedules,
      error: undefined,
    };
  }

  async findAllByCoachId(data: FindAllAgendaByCoachOptions) {
    const schedules = await this._agendaRepository.findAllByCoachId(data);

    return {
      result: schedules,
      error: undefined,
    };
  }

  async findScheduleByDate(data: FindScheduleByDateOptions) {
    const schedules = await this._agendaRepository.findScheduleByDate(data);

    return {
      result: schedules,
      error: undefined,
    };
  }

  async findScheduleById(id: SelectAgenda['id']) {
    const singleSchedule = await this._agendaRepository.findScheduleById(id);

    if (!singleSchedule) {
      return {
        error: new Error('Schedule not found'),
      };
    }

    return {
      result: singleSchedule,
    };
  }

  async findAgendaByUserId(data: FindAgendaByUserOptions) {
    const agendas = await this._agendaRepository.findAgendaByUserId(data);

    return {
      result: agendas,
      error: undefined,
    };
  }

  async create(data: InsertAgenda) {
    const result = await this._agendaRepository.create(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async createAgendaBooking(data: InsertAgendaBooking) {
    const user = await this._userRepository.findById(data.user_id);

    if (!user) {
      return {
        error: new Error('User not found'),
      };
    }

    const agenda = await this._agendaRepository.findById(data.agenda_id);
    if (!agenda) {
      return {
        error: new Error('Agenda not found'),
      };
    }

    const agendaClass = await this._classRepository.findById(agenda.class_id);

    if (!agendaClass) {
      return {
        error: new Error('Class not found'),
      };
    }

    const agendaLocation =
      await this._locationRepository.findLocationByFacilityId(
        agenda.location_facility_id
      );

    if (!agendaLocation) {
      return {
        error: new Error('Location not found'),
      };
    }

    const countParticipant = await this._agendaRepository.countParticipant(
      data.agenda_id
    );

    if (countParticipant >= agendaClass.slot) {
      return {
        error: new Error('Class is full'),
      };
    }

    const userPackage = await this._packageRepository.findAboutToExpiredPackage(
      user.id,
      agendaClass.class_type_id
    );

    if (!userPackage) {
      return {
        error: new Error('User does not have a package for this class'),
      };
    }

    const credit = await this._creditRepository.findAmountByUserId(user.id);
    if (!credit) {
      return {
        error: new Error('User does not have any credit'),
      };
    }

    const currentCredit = credit.find(
      (item) => item.class_type_id === agendaClass.class_type_id
    );

    if (!currentCredit || currentCredit.remaining_amount < 1) {
      return {
        error: new Error('User does not have any credit for this class'),
      };
    }
    const userAgenda = await this._agendaRepository.findActiveAgendaByUserId(
      user.id
    );

    const creditTransaction = await this._creditRepository.findByUserPackageId(
      userPackage.id
    );

    if (!creditTransaction) {
      return {
        error: new Error('Credit transaction not found'),
      };
    }

    // iterate over userAgenda to check if user overlaps with existing agenda
    // const agendaEndTime = addMinutes(agenda.time, agendaClass.duration);

    for (const userAgendaItem of userAgenda) {
      const userAgendaEndTime = addMinutes(
        userAgendaItem.time,
        userAgendaItem.class_duration
      );

      if (
        (isBefore(userAgendaItem.time, agenda.time) ||
          isEqual(userAgendaItem.time, agenda.time)) &&
        (isAfter(userAgendaEndTime, agenda.time) ||
          isEqual(userAgendaEndTime, agenda.time))
      ) {
        return {
          error: new Error('User already has an agenda at this time'),
        };
      }
    }

    const inputData: InsertAgendaAndTransaction = {
      ...data,
      status: 'booked',
      credit_transaction_id: creditTransaction.id,
      class_type_id: agendaClass.class_type_id,
      type: 'credit',
      amount: 1,
      note: `Booked ${agendaClass.name} class on ${agenda.time}`,
    };

    const result = await this._agendaRepository.createAgendaBooking(inputData);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    const notification = await this._notificationService.sendNotification({
      payload: {
        type: NotificationType.UserBookedAgenda,
        date: agenda.time,
        class: agendaClass.name,
        duration: agendaClass.duration,
        location: agendaLocation.name,
        facility: agendaLocation.facility_name,
      },
      recipient: user.phone_number,
    });

    if (notification.error) {
      return {
        error: notification.error,
      };
    }

    return {
      result,
    };
  }

  async update(data: UpdateAgenda) {
    const result = await this._agendaRepository.update(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }

  async updateAgendaBooking(data: UpdateAgendaBooking) {
    const result = await this._agendaRepository.updateAgendaBooking(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }

  async updateAgendaBookingById(data: UpdateAgendaBookingById) {
    const result = await this._agendaRepository.updateAgendaBookingById(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }

  async delete(id: SelectAgenda['id']) {
    const result = await this._agendaRepository.delete(id);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }
}
