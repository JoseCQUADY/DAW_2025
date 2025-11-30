import axiosInstance from '../utils/axiosInstance';


export const getSystemStats = async () => {
    const response = await axiosInstance.get('/stats');
    return response.data;
};


export const getEquiposSummary = async () => {
    const response = await axiosInstance.get('/stats/equipos-summary');
    return response.data;
};


export const getMantenimientosDetalle = async (equipoId = null) => {
    const params = equipoId ? `?equipoId=${equipoId}` : '';
    const response = await axiosInstance.get(`/stats/mantenimientos-detalle${params}`);
    return response.data;
};

export const getEquiposPendientes = async () => {
    const response = await axiosInstance.get('/stats/equipos-pendientes');
    return response.data;
};
