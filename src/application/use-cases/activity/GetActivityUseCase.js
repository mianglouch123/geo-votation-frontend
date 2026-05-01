// application/use-cases/activity/GetActivityUseCase.js
export class GetActivityUseCase {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  execute = async ({ page = 1, limit = 20 }) => {
    const params = { page, limit };
    const response = await this.activityRepository.getActivity(params);

    return {
      data: response.data,
      pagination: response.pagination,
      message: response.message
    };
  };
}