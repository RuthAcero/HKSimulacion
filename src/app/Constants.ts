export const Constants = {
    addin_container: '#app-security',
    modules: [
        { moduleId: 1, moduleName: "MONITOREO" },
        { moduleId: 2, moduleName: "REPORTES" },
        { moduleId: 3, moduleName: "VEHÍCULOS" },
        { moduleId: 4, moduleName: "USUARIOS" },
        { moduleId: 5, moduleName: "ROLES" }
    ],
    columnsGO: [
        { header: 'Económico', key: 'name', placeholder: 'Búscar por económico' },
        { header: 'Placa', key: 'plate', placeholder: 'Búscar por placa' },
        { header: 'VIN', key: 'vin', placeholder: 'Búscar por vin' },
        { header: 'Número serial', key: 'serialNumber', placeholder: 'Búscar por num. serial' },
        { header: 'Dispositivo', key: 'deviceName', placeholder: 'Búscar por dispositivo' },
    ],
    columnsST: [
        { header: 'Económico', key: 'name', placeholder: 'Búscar por económico' },
        { header: 'IMEI', key: 'imei', placeholder: 'Búscar por IMEI' },
        { header: 'IMEI-CUT', key: 'imeiCut', placeholder: 'Búscar por IMEI-CUT' },
        { header: 'Placa', key: 'plate', placeholder: 'Búscar por placa' },
    ],
    columnsUsers: [
        { header: 'Usuario', key: 'userName', placeholder: 'Búscar por usuario' },
        { header: 'Nombre', key: 'name', placeholder: 'Búscar por nombre' },
        { header: 'Apellidos', key: 'lastName', placeholder: 'Búscar por apellidos' },
        { header: 'Rol', key: 'roleName', placeholder: 'Búscar por rol' },
    ],
    columnsRoles: [
        { header: 'Módulo', key: 'moduleName' },
        { header: 'Ver', key: 'read' },
        { header: 'Crear', key: 'write' },
        { header: 'Editar', key: 'edit' },
        { header: 'Eliminar', key: 'delete' },
        { header: 'Descargar', key: 'download' },
    ],
    markerSGV: 'm6.210664,24.128505l6.40625,-20.937498l6.40625,20.937498l-12.812501,0z',
    markerSGVStop: 'm1.201863,14.303764l13.089577,-13.207501l13.089577,13.207501l-13.089577,13.207501l-13.089577,-13.207501z',
}
