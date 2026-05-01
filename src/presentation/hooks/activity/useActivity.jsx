import { useCallback } from "react";
import { UsePagination } from "../common/UsePagination.jsx";
import { ActivityRepositoryImpl } from "../../../infraestructure/repositories/ActivityRepositoryImpl.js";
import { GetActivityUseCase } from "../../../application/use-cases/activity/GetActivityUseCase.js";


const activityRepository = new ActivityRepositoryImpl();
const getActivityUseCase = new GetActivityUseCase(activityRepository);

export function UseActivity() {
  const fetchActivities = useCallback(async ({ page , limit }) => {
   return await getActivityUseCase.execute({ page , limit });
} , []);
  
return UsePagination(fetchActivities);
  
}