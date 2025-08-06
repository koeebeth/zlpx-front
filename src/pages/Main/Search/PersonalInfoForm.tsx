import { FC, useState } from "react";
import { type UserProfile } from "../../../types";
import { telegramService } from "../../../lib/telegram";

type PropsT = {
  user: UserProfile;
  setUser: (payload: UserProfile) => void;
  updateUserProfile?: (fields: Partial<UserProfile>) => Promise<boolean>;
};

export const PersonalInfoForm: FC<PropsT> = ({ user, setUser, updateUserProfile }) => {
  const [formData, setFormData] = useState({
    live_metro_station: user.live_metro_station || [],
    study_metro_station: user.study_metro_station || [],
    date_of_birth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '',
    has_printer: user.has_printer,
    can_host_night: user.can_host_night,
    has_driver_license: user.has_driver_license,
    year_of_admission: user.year_of_admission,
    status: user.status
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const changedFields: Partial<UserProfile> = {};
    if (formData.live_metro_station !== user.live_metro_station) changedFields.live_metro_station = formData.live_metro_station;
    if (formData.study_metro_station !== user.study_metro_station) changedFields.study_metro_station = formData.study_metro_station;
    if (formData.date_of_birth !== (user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '')) changedFields.date_of_birth = formData.date_of_birth;
    if (formData.has_printer !== user.has_printer) changedFields.has_printer = formData.has_printer;
    if (formData.can_host_night !== user.can_host_night) changedFields.can_host_night = formData.can_host_night;
    if (formData.has_driver_license !== user.has_driver_license) changedFields.has_driver_license = formData.has_driver_license;
    if (formData.year_of_admission !== user.year_of_admission) changedFields.year_of_admission = formData.year_of_admission;
    if (formData.status !== user.status) changedFields.status = formData.status;

    if (updateUserProfile && Object.keys(changedFields).length > 0) {
      const success = await updateUserProfile(changedFields);
      if (success) {
        setUser({ ...user, ...changedFields });
        telegramService.showAlert("Личная информация обновлена!");
      } else {
        telegramService.showAlert("Ошибка при обновлении информации");
      }
    } else {
      setUser({ ...user, ...changedFields });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="block text-sm dark:text-zinc-300 mb-1">Станции метро (живет):</label>
        <input
          type="text"
          value={formData.live_metro_station.join(', ')}
          onChange={(e) => setFormData(prev => ({ ...prev, live_metro_station: e.target.value.split(',').map(s => s.trim()) }))}
          className="w-full p-2 rounded bg-zinc-300 dark:bg-zinc-700 text-sm"
          placeholder="Введите станции через запятую"
        />
      </div>
      
      <div>
        <label className="block text-sm dark:text-zinc-300 mb-1">Станции метро (учится):</label>
        <input
          type="text"
          value={formData.study_metro_station.join(', ')}
          onChange={(e) => setFormData(prev => ({ ...prev, study_metro_station: e.target.value.split(',').map(s => s.trim()) }))}
          className="w-full p-2 rounded bg-zinc-300 dark:bg-zinc-700 text-sm"
          placeholder="Введите станции через запятую"
        />
      </div>
      
      <div>
        <label className="block text-sm dark:text-zinc-300 mb-1">Дата рождения:</label>
        <input
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
          className="w-full p-2 rounded bg-zinc-300 dark:bg-zinc-700 text-sm"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="has_printer"
          checked={formData.has_printer}
          onChange={(e) => setFormData(prev => ({ ...prev, has_printer: e.target.checked }))}
          className="rounded"
        />
        <label htmlFor="has_printer" className="text-sm dark:text-zinc-300">Есть принтер</label>
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="can_host_night"
          checked={formData.can_host_night}
          onChange={(e) => setFormData(prev => ({ ...prev, can_host_night: e.target.checked }))}
          className="rounded"
        />
        <label htmlFor="can_host_night" className="text-sm dark:text-zinc-300">Может проводить НК</label>
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="has_driver_license"
          checked={formData.has_driver_license}
          onChange={(e) => setFormData(prev => ({ ...prev, has_driver_license: e.target.checked }))}
          className="rounded"
        />
        <label htmlFor="has_driver_license" className="text-sm dark:text-zinc-300">Есть права/машина</label>
      </div>
      
      <div>
        <label className="block text-sm dark:text-zinc-300 mb-1">Год вступления в СТС:</label>
        <input
          type="number"
          value={formData.year_of_admission}
          onChange={(e) => setFormData(prev => ({ ...prev, year_of_admission: parseInt(e.target.value) || 0 }))}
          className="w-full p-2 rounded bg-zinc-300 dark:bg-zinc-700 text-sm"
          min="2000"
          max="2030"
        />
      </div>
      
      <div>
        <label className="block text-sm dark:text-zinc-300 mb-1">Статус:</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
          className="w-full p-2 rounded bg-zinc-300 dark:bg-zinc-700 text-sm"
        >
          <option value="active">Активный</option>
          <option value="inactive">Неактивный</option>
          <option value="alumni">Выпускник</option>
        </select>
      </div>
      
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
      >
        Сохранить
      </button>
    </form>
  );
}; 