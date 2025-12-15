import { useState, useEffect } from 'react';
import moment from 'moment';
import partidosService from '../services/PartidoService';

interface UsePartidosUsuarioOptions {
  filterType: 'future' | 'past';
}

export const usePartidosUsuario = ({ filterType }: UsePartidosUsuarioOptions) => {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cargarPartidosDesignados = async () => {
      try {
        setLoading(true);
        const usuarioId = localStorage.getItem("userId");
        if (!usuarioId) {
          setPartidos([]);
          return;
        }

        const partidosDesignados = await partidosService.getPartidosByUserId(usuarioId);

        if (Array.isArray(partidosDesignados)) {
          const partidosFiltrados = partidosDesignados.filter((partido) => {
            const fechaCompleta = moment(`${partido.fecha} ${partido.hora}`, "YYYY-MM-DD HH:mm:ss");
            return filterType === 'future' 
              ? fechaCompleta.isAfter(moment()) 
              : fechaCompleta.isBefore(moment());
          });

          const partidosOrdenados = partidosFiltrados.sort((a, b) => {
            const fechaA = moment(`${a.fecha} ${a.hora}`, "YYYY-MM-DD HH:mm:ss");
            const fechaB = moment(`${b.fecha} ${b.hora}`, "YYYY-MM-DD HH:mm:ss");
            return filterType === 'future'
              ? fechaA.valueOf() - fechaB.valueOf()
              : fechaA.diff(fechaB);
          });

          setPartidos(partidosOrdenados);
        } else {
          setPartidos([]);
        }
      } catch (err) {
        console.error("Error al cargar los partidos designados:", err);
        setError(err as Error);
        setPartidos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarPartidosDesignados();
  }, [filterType]);

  return { partidos, loading, error, setPartidos };
};

