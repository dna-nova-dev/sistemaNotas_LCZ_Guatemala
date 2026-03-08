"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { BoletaNursery } from "./BoletaNursery";
import { BoletaPreKinder } from "./BoletaPreKinder";
import { BoletaKinder } from "./BoletaKinder";
import { BoletaPreparatoria } from "./BoletaPreparatoria";
import { BoletaGeneral } from "./BoletaGeneral";
import { BoletaPrimeroPrimaria } from "./BoletaPrimeroPrimaria";

import {
  obtenerMatrizNotas,
  guardarCalificacionesMasivas,
  obtenerPermisosUsuario,
  obtenerMaestroTitular,
  obtenerConfiguracionActiva
} from "../../actions";

const INTERVALO_AUTOSAVE_MS = 2 * 60 * 1000;

export default function CalificacionesPage() {
  const [grado, setGrado] = useState("");
  const [seccion, setSeccion] = useState("");
  const [estudiantesAgrupados, setEstudiantesAgrupados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [expandidos, setExpandidos] = useState<number[]>([]);
  const [permisos, setPermisos] = useState<any>(null);

  const [anioEscolar, setAnioEscolar] = useState<number>(new Date().getFullYear());
  const [unidadesHabilitadas, setUnidadesHabilitadas] = useState<number[]>([1]);

  const [alumnosGuardando, setAlumnosGuardando] = useState<number[]>([]);
  const estudiantesRef = useRef(estudiantesAgrupados);

  const [imprimiendoMasivo, setImprimiendoMasivo] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const [alumnoParaImprimir, setAlumnoParaImprimir] = useState<any>(null);
  const [unidadAImprimir, setUnidadAImprimir] = useState(3);

  useEffect(() => {
    estudiantesRef.current = estudiantesAgrupados;
  }, [estudiantesAgrupados]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Boletas_${grado}_Seccion${seccion}_${anioEscolar}`,
  });

  const handleImpresionMasiva = (unidad: number) => {
    setUnidadAImprimir(unidad);
    setImprimiendoMasivo(true);
    setAlumnoParaImprimir(null);
    setTimeout(() => {
      handlePrint();
      setTimeout(() => setImprimiendoMasivo(false), 500);
    }, 800);
  };

  const NIVELES = [
    {
      nivel: "Pre-Primaria",
      grados: [
        { id: "11", nombre: "Nursery I", secciones: [{ id: "1", label: "Única" }] },
        { id: "12", nombre: "Nursery II", secciones: [{ id: "1", label: "Única" }] },
        { id: "13", nombre: "Nursery III", secciones: [{ id: "1", label: "Única" }] },
        { id: "4", nombre: "Pre-Kinder", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }] },
        { id: "5", nombre: "Kinder", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }] },
        { id: "1", nombre: "Preparatoria", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }] },
      ],
    },
    {
      nivel: "Primaria",
      grados: [
        { id: "6", nombre: "1ro Primaria", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }] },
        { id: "7", nombre: "2do Primaria", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }] },
        { id: "2", nombre: "3ro Primaria", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }] },
        { id: "8", nombre: "4to Primaria", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }] },
        { id: "9", nombre: "5to Primaria", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }] },
        { id: "10", nombre: "6to Primaria", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }] },
      ],
    },
    {
      nivel: "Básico",
      grados: [
        { id: "14", nombre: "Primero Básico", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }] },
        { id: "15", nombre: "Segundo Básico", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }] },
        { id: "16", nombre: "Tercero Básico", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }, { id: "3", label: "C" }] },
      ],
    },
    {
      nivel: "Diversificado",
      grados: [
        { id: "17", nombre: "Cuarto Bachillerato", secciones: [{ id: "1", label: "A" }, { id: "2", label: "B" }] },
        { id: "18", nombre: "Quinto Bachillerato", secciones: [{ id: "1", label: "Única" }] },
        { id: "19", nombre: "Cuarto Perito", secciones: [{ id: "1", label: "Única" }] },
        { id: "20", nombre: "Quinto Perito", secciones: [{ id: "1", label: "Única" }] },
        { id: "21", nombre: "Sexto Perito", secciones: [{ id: "1", label: "Única" }] },
      ],
    },
  ];

  const gradoSeleccionadoObj = NIVELES.flatMap((n) => n.grados).find(
    (g) => g.id === grado,
  );

  useEffect(() => {
    async function cargarInicial() {
      const p = await obtenerPermisosUsuario();
      setPermisos(p);
      
      const config = await obtenerConfiguracionActiva();
      setAnioEscolar(config.anio); 
      setUnidadesHabilitadas(config.activas);
    }
    cargarInicial();
  }, []);

  const curricularesNurseryBase = [
    { id_materia: 6, materia: "Comunicación y Lenguaje", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 7, materia: "Destrezas de Aprendizaje", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 8, materia: "Conocimiento de su mundo", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 9, materia: "Educación Cristiana", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 10, materia: "Expresión Artística", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" }, // 💡 Restaurado
    { id_materia: 11, materia: "Idioma Inglés", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 12, materia: "Motricidad", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const aspectosNurseryBase = [
    { id_materia: 13, materia: "Participa activamente en clase", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 14, materia: "Es responsable con sus deberes y obligaciones", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 15, materia: "Termina tareas a tiempo", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 16, materia: "Practica valores morales diariamente", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 17, materia: "Aplica hábitos higiénicos en sus actividades", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 18, materia: "Autonomía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 19, materia: "Conducta", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 20, materia: "Puntualidad", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];

  const curricularesPreKinderBase = [
    { id_materia: 1, materia: "Educación Para la Ciencia y la Ciudadanía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 2, materia: "Destreza de Comunicación y Lenguaje", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 35, materia: "Destrezas de Aprendizaje Matemático", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 36, materia: "Educación Física", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 37, materia: "Educación Musical", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 38, materia: "Artes Visuales", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 39, materia: "Educación Cristiana", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const aspectosPreKinderBase = [
    { id_materia: 40, materia: "Participa activamente en clase", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 41, materia: "Es responsable con sus deberes y obligaciones", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 42, materia: "Termina tareas a tiempo", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 43, materia: "Practica valores morales diariamente", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 44, materia: "Aplica hábitos higiénicos en sus actividades", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 45, materia: "Autonomía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 46, materia: "Conducta", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 47, materia: "Puntualidad", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const curricularesKinderBase = [
    { id_materia: 48, materia: "Educación Para la Ciencia y la Ciudadanía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 49, materia: "Destreza de Comunicación y Lenguaje", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 50, materia: "Destrezas de Aprendizaje Matemático", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 51, materia: "Educación Física", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 52, materia: "Educación Musical", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 53, materia: "Artes Visuales", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 54, materia: "Idioma Inglés", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 55, materia: "Educación Cristiana", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const aspectosKinderBase = [
    { id_materia: 56, materia: "Participa activamente en clase", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 57, materia: "Es responsable con sus deberes y obligaciones", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 58, materia: "Termina tareas a tiempo", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 59, materia: "Practica valores morales diariamente", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 60, materia: "Aplica hábitos higiénicos en sus actividades", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 61, materia: "Autonomía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 62, materia: "Conducta", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 63, materia: "Puntualidad", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const curricularesPreparatoriaBase = [
    { id_materia: 64, materia: "Educación Para la Ciencia y la Ciudadanía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 65, materia: "Destreza de Comunicación y Lenguaje", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 66, materia: "Destrezas de Aprendizaje Matemático", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 67, materia: "Educación Física", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 68, materia: "Educación Musical", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 69, materia: "Artes Visuales", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 70, materia: "Idioma Inglés", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 71, materia: "Educación Cristiana", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const aspectosPreparatoriaBase = [
    { id_materia: 72, materia: "Participa activamente en clase", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 73, materia: "Es responsable con sus deberes y obligaciones", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 74, materia: "Termina tareas a tiempo", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 75, materia: "Practica valores morales diariamente", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 76, materia: "Aplica hábitos higiénicos en sus actividades", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 77, materia: "Autonomía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 78, materia: "Conducta", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 79, materia: "Puntualidad", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];

  const bloquesPrimariaBase = {
    1: [
      { id_materia: 104, materia: "Idioma Materno", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 105, materia: "Tercer Idioma Inglés", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 106, materia: "Matemáticas", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 107, materia: "Ciencias Sociales", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 108, materia: "Ciencias Naturales y Tecnología", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 109, materia: "Expresión Artística Música", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" }, // 💡 Restaurado
      { id_materia: 110, materia: "Educación Física", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 111, materia: "Formación Ciudadana", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 112, materia: "Ortografía", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 113, materia: "Artes plásticas", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 114, materia: "Moral Cristiana", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 115, materia: "Computación", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
    ],
    2: [
      { id_materia: 116, materia: "Comprensión de Lectura", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 117, materia: "Lógica Matemática", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    ],
    3: [
      { id_materia: 118, materia: "Respeta autoridad", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 119, materia: "Interactúa bien con sus compañeros", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 120, materia: "Respeta los derechos y propiedades de otros", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 121, materia: "Demuestra control de sí mismo", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 122, materia: "Acepta responsabilidad de sus acciones", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    ],
    4: [
      { id_materia: 123, materia: "Llega a tiempo", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 124, materia: "Viene preparado para aprender", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 125, materia: "Termina tareas", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 126, materia: "Lee diariamente en casa", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 127, materia: "Atiende junta de padres y maestros", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 128, materia: "Práctica matemáticas diariamente", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 129, materia: "Práctica vocabulario de inglés diariamente", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    ],
    5: [
      { id_materia: 130, materia: "Completa trabajo / asignatura a tiempo", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 131, materia: "Regresa tareas terminadas y notas firmadas a tiempo", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 132, materia: "Participa e interactúa en actividades de aprendizaje", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 133, materia: "Práctica valores morales diariamente", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    ],
  };

  const bloquesBasicoBase = {
    1: [
      { id_materia: 218, materia: "Matemáticas", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 248, materia: "Culturas e Idiomas Mayas, Garífuna o Xinca", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 210, materia: "Comunicación y Lenguaje, Idioma Español", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 201, materia: "Comunicación y Lenguaje Idioma Extranjero", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 246, materia: "Ciencias Naturales", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 200, materia: "Ciencias Sociales, Formación Ciudadana e Interculturalidad", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 243, materia: "Educación Musical", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 227, materia: "Artes Visuales", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 249, materia: "Teatro", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 250, materia: "Danza", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 220, materia: "Emprendimiento para la Productividad", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 244, materia: "Tecnologías del Aprendizaje y la Comunicación", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 245, materia: "Educación Física", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
    ]
  };

  const bloque2ExtracurricularTexto = [
    { id_materia: 247, materia: "Razonamiento Verbal", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 251, materia: "Programa de Lectura", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 233, materia: "Moral Cristiana", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
  ];
  
  const bloque3PeritoExtracurricularTexto = [
    { id_materia: 251, materia: "Programa de Lectura", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 233, materia: "Moral Cristiana", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
  ];

  const bloqueResponsabilidad = [
    { id_materia: 252, materia: "Respeta Autoridad", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 253, materia: "Interactúa bien con sus compañeros", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 254, materia: "Acepta Responsabilidad de sus acciones", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 255, materia: "Práctica Valores Morales diariamente", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 256, materia: "Responsable en Clase", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 257, materia: "Completa Trabajos a Tiempo", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 258, materia: "Participa en actividades de aprendizaje", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 259, materia: "Llega a tiempo", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 260, materia: "Atiende juntas de padres", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 261, materia: "Práctica diariamente lo estudiado", tipo: "Texto_Primaria", u1: "", u2: "", u3: "", u4: "" },
  ];

  const PENSUM_MEDIO: Record<string, any[]> = {
    "17": [
      { id_materia: 262, materia: "Lengua y Literatura 4", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 263, materia: "Comunicación Y Lenguaje L3 (Inglés Técnico) 4", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 264, materia: "Tecnología de Información y la comunicación 4", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 265, materia: "Matemáticas 4", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 266, materia: "Física", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 267, materia: "Ciencias Sociales y Formación Ciudadana 4", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 228, materia: "Psicología", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 245, materia: "Educación Física", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 205, materia: "Elaboración y Gestión de Proyectos", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 234, materia: "Filosofía", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 203, materia: "Metodología de la Investigación", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 242, materia: "Razonamiento Matemático", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
    ],
    "18": [
      { id_materia: 268, materia: "Lengua y Literatura 5", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 269, materia: "Comunicación Y Lenguaje L3 (Inglés Técnico) 5", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 270, materia: "Tecnología de Información y la comunicación 5", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 271, materia: "Matemáticas 5", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 272, materia: "Estadística Descriptiva", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 219, materia: "Biología", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 217, materia: "Química", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 273, materia: "Ciencias Sociales y Formación Ciudadana 5", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 229, materia: "Expresión Artística", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" }, // 💡 Restaurado
      { id_materia: 207, materia: "Seminario", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 242, materia: "Razonamiento Matemático", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
    ],
  };

  const PENSUM_PERITO_B1: Record<string, any[]> = {
    "19": [
      { id_materia: 202, materia: "Contabilidad de Sociedades", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 237, materia: "Matemática Comercial", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 211, materia: "Fundamentos de Derecho", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 274, materia: "Inglés Comercial", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 275, materia: "Redacción y Correspondencia Mercantil", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 222, materia: "Introducción a la Economía", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 276, materia: "Ortografía y Caligrafía", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 277, materia: "Administración y Organización de Oficina", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 278, materia: "Computación I", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 279, materia: "Programación I", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
    ],
    "20": [
      { id_materia: 223, materia: "Contabilidad de Costos", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 281, materia: "Cálculo Mercantil y Financiero", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 282, materia: "Inglés Comercial II", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 283, materia: "Legislación Fiscal y Aduana", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 284, materia: "Finanzas Públicas", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 285, materia: "Geografía Económica", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 225, materia: "Catalogación y Archivo", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 204, materia: "Mecanografía", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 286, materia: "Computación II", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 287, materia: "Programación II", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
    ],
    "21": [
      { id_materia: 209, materia: "Contabilidad Bancaria", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 290, materia: "Contabilidad Gubernamental Integrada", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 291, materia: "Estadística Comercial", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 292, materia: "Organización de Empresas", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 293, materia: "Ética Profesional y Relaciones Humanas", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 294, materia: "Práctica Supervisada", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 208, materia: "Auditoría", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 295, materia: "Derecho Mercantil y Nociones de Derecho Laboral", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 296, materia: "Computación III", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 297, materia: "Seminario sobre problemas socio económicos de Guatemala", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 298, materia: "Programación III", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
    ],
  };

  const PENSUM_PERITO_B2: Record<string, any[]> = {
    "19": [
      { id_materia: 238, materia: "Matemática Básica", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 266, materia: "Física", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 280, materia: "Métodos de la investigación", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
    ],
    "20": [
      { id_materia: 238, materia: "Matemática Básica", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 288, materia: "Química General", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 289, materia: "Gestión de Proyectos", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
    ],
    "21": [
      { id_materia: 238, materia: "Matemática Básica", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
      { id_materia: 299, materia: "Biología General", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" },
    ],
  };

  // 💡 MANTENEMOS EL ORDEN INVERTIDO PARA QUE SALGA HÁBITOS AL FINAL EN LA WEB Y EN LA BOLETA GENERAL
  const areasPrimaria = [
    { id: 1, titulo: "1. Áreas Académicas" },
    { id: 2, titulo: "2. Programas Educativos Extracurriculares" },
    { id: 3, titulo: "3. Responsabilidades del estudiante con su comportamiento" },
    { id: 5, titulo: "4. Responsabilidad del estudiante con su aprendizaje" },
    { id: 4, titulo: "5. Hábitos Practicados en casa" },
  ];

  const areasBasico = [
    { id: 1, titulo: "1. Áreas y Sub áreas" },
    { id: 2, titulo: "2. Áreas Educativas Extracurriculares" },
    { id: 3, titulo: "3. Responsabilidad del Estudiante" },
  ];

  const areasBachillerato = [
    { id: 1, titulo: "1. Áreas Académicas" },
    { id: 2, titulo: "2. Áreas Extracurriculares" },
    { id: 3, titulo: "3. Responsabilidad del Estudiante" },
  ];

  const areasPerito = [
    { id: 1, titulo: "1. Áreas Académicas" },
    { id: 2, titulo: "2. Áreas Académicas Extracurriculares" },
    { id: 3, titulo: "3. Áreas Extracurriculares" },
    { id: 4, titulo: "4. Responsabilidad del Estudiante" },
  ];

  const puedeVerGrado = (idG: string) => {
    if (!permisos) return false;
    if (permisos.rol === "Admin" || permisos.rol === "Super usuario" || permisos.asignaciones === "ALL") return true;
    return permisos.asignaciones.some((a: any) => a.id_grado.toString() === idG);
  };

  const puedeVerSeccion = (idS: string) => {
    if (!permisos || !grado) return false;
    if (permisos.rol === "Admin" || permisos.rol === "Super usuario" || permisos.asignaciones === "ALL") return true;
    return permisos.asignaciones.some((a: any) => a.id_grado.toString() === grado && a.seccion.toString() === idS);
  };

  const puedeEditarMateria = (idM: number) => {
    if (!permisos) return false;
    if (permisos.rol === "Admin" || permisos.rol === "Super usuario" || permisos.asignaciones === "ALL") return true;

    const esPrePrimariaOPrimaria = ["11", "12", "13", "4", "5", "1", "6", "7", "2", "8", "9", "10"].includes(grado);
    
    if (esPrePrimariaOPrimaria) {
      const asignadoASeccion = permisos.asignaciones.some(
        (a: any) => a.id_grado.toString() === grado && a.seccion.toString() === seccion
      );
      if (asignadoASeccion) return true;
    }

    return permisos.asignaciones.some((a: any) => a.id_grado.toString() === grado && a.seccion.toString() === seccion && a.id_materia === idM);
  };

  const calcularPromedioUnidad = (materias: any[], unidad: string) => {
    const numericas = materias.filter((m) => m.tipo === "Numerica");
    if (numericas.length === 0) return "-";
    const notasValidas = numericas.map((m) => parseFloat(m[unidad])).filter((n) => !isNaN(n));
    if (notasValidas.length === 0) return "0";
    const suma = notasValidas.reduce((a, b) => a + b, 0);
    return Math.round(suma / numericas.length);
  };

  const calcularPromedioCombinado = (bloque1: any[], bloque2: any[], unidad: string) => {
    const numericas1 = bloque1.filter((m) => m.tipo === "Numerica");
    const numericas2 = bloque2.filter((m) => m.tipo === "Numerica");
    const todasLasNumericas = [...numericas1, ...numericas2];
    
    if (todasLasNumericas.length === 0) return "-";
    const notasValidas = todasLasNumericas.map((m) => parseFloat(m[unidad])).filter((n) => !isNaN(n));
    if (notasValidas.length === 0) return "0";
    
    const suma = notasValidas.reduce((a, b) => a + b, 0);
    return Math.round(suma / todasLasNumericas.length);
  };

  const handleCargarAlumnos = async () => {
    if (!grado || !seccion) return alert("⚠️ Selecciona Grado y Sección.");
    if (!puedeVerSeccion(seccion)) return alert("⛔ No tienes permiso para esta sección.");
    
    setCargando(true);
    let idGFinal = Number(grado);
    let idSFinal = Number(seccion);

    try {
      const datos = await obtenerMatrizNotas(idGFinal, idSFinal);
      const nombreMaestraBD = await obtenerMaestroTitular(idGFinal, idSFinal);

      if (datos && datos.length > 0) {
        const agrupados = datos.reduce((acc: any, curr: any) => {
          const nombre = curr.nombre_completo || curr.NOMBRE || `${curr.nombres} ${curr.apellidos}`;
          const idAlumno = curr.id_alumno || curr.ID_ALUMNO;

          if (!idAlumno) return acc;

          const esNursery = [11, 12, 13].includes(idGFinal);
          const esPreKinder = idGFinal === 4;
          const esKinder = idGFinal === 5;
          const esPreparatoria = idGFinal === 1;
          const esPrePrimaria = esNursery || esPreKinder || esKinder || esPreparatoria;
          
          const esPrimaria = [6, 7, 2, 8, 9, 10].includes(idGFinal);
          const esBasico = [14, 15, 16].includes(idGFinal);
          const esBachillerato = [17, 18].includes(idGFinal);
          const esPerito = [19, 20, 21].includes(idGFinal);

          if (!acc[nombre]) {
            let cur: any[] = []; let asp: any[] = [];
            let blqs: any = { 1: [], 2: [], 3: [], 4: [], 5: [] };

            if (esNursery) { cur = curricularesNurseryBase.map((m) => ({ ...m })); asp = aspectosNurseryBase.map((m) => ({ ...m })); } 
            else if (esPreKinder) { cur = curricularesPreKinderBase.map((m) => ({ ...m })); asp = aspectosPreKinderBase.map((m) => ({ ...m })); } 
            else if (esKinder) { cur = curricularesKinderBase.map((m) => ({ ...m })); asp = aspectosKinderBase.map((m) => ({ ...m })); } 
            else if (esPreparatoria) { cur = curricularesPreparatoriaBase.map((m) => ({ ...m })); asp = aspectosPreparatoriaBase.map((m) => ({ ...m })); } 
            else if (esPrimaria) {
              blqs = {
                1: bloquesPrimariaBase[1].map((m) => ({ ...m })), 2: bloquesPrimariaBase[2].map((m) => ({ ...m })),
                3: bloquesPrimariaBase[3].map((m) => ({ ...m })), 4: bloquesPrimariaBase[4].map((m) => ({ ...m })),
                5: bloquesPrimariaBase[5].map((m) => ({ ...m })),
              };
              if ([8, 9, 10].includes(idGFinal)) {
                const idxFormacion = blqs[1].findIndex((m: any) => m.id_materia === 111 || m.materia === "Formación Ciudadana");
                const insertAt = idxFormacion === -1 ? blqs[1].length : idxFormacion + 1;
                blqs[1].splice(insertAt, 0, { id_materia: 134, materia: "Productividad y Desarrollo", tipo: "Numerica", u1: "", u2: "", u3: "", u4: "" });
              }
            } 
            else if (esBasico) {
              blqs = {
                1: bloquesBasicoBase[1].map((m) => ({ ...m })), 2: bloque2ExtracurricularTexto.map((m) => ({ ...m })),
                3: bloqueResponsabilidad.map((m) => ({ ...m })), 4: [], 5: [],
              };
            } 
            else if (esBachillerato) {
              const materiasDelGrado = PENSUM_MEDIO[idGFinal.toString()] || [];
              blqs = { 
                1: materiasDelGrado.map((m) => ({ ...m })), 
                2: bloque2ExtracurricularTexto.map((m) => ({ ...m })), 
                3: bloqueResponsabilidad.map((m) => ({ ...m })), 
                4: [], 5: [] 
              };
            }
            else if (esPerito) {
              const matB1 = PENSUM_PERITO_B1[idGFinal.toString()] || [];
              const matB2 = PENSUM_PERITO_B2[idGFinal.toString()] || [];
              blqs = { 
                1: matB1.map((m) => ({ ...m })), 
                2: matB2.map((m) => ({ ...m })), 
                3: bloque3PeritoExtracurricularTexto.map((m) => ({ ...m })), 
                4: bloqueResponsabilidad.map((m) => ({ ...m })), 
                5: [] 
              };
            }

            acc[nombre] = { id_alumno: idAlumno, nombre, maestro: nombreMaestraBD, curriculares: cur, aspectos: asp, bloques: blqs, id_grado: idGFinal };
          }

          const idMateria = Number(curr.ID_MATERIA || curr.id_materia);
          if (!idMateria) return acc;

          const u1 = curr.U1 || curr.unidad_1 || ""; const u2 = curr.U2 || curr.unidad_2 || "";
          const u3 = curr.U3 || curr.unidad_3 || ""; const u4 = curr.U4 || curr.unidad_4 || "";

          if (esPrePrimaria) {
            const itemCurricular = acc[nombre].curriculares.find((m: any) => m.id_materia === idMateria);
            if (itemCurricular) { itemCurricular.u1 = u1; itemCurricular.u2 = u2; itemCurricular.u3 = u3; itemCurricular.u4 = u4; }
            const itemAspecto = acc[nombre].aspectos.find((m: any) => m.id_materia === idMateria);
            if (itemAspecto) { itemAspecto.u1 = u1; itemAspecto.u2 = u2; itemAspecto.u3 = u3; itemAspecto.u4 = u4; }
          } else if (esPrimaria || esBasico || esBachillerato || esPerito) {
            for (let i = 1; i <= 5; i++) {
              const item = acc[nombre].bloques[i].find((m: any) => m.id_materia === idMateria);
              if (item) { item.u1 = u1; item.u2 = u2; item.u3 = u3; item.u4 = u4; break; }
            }
          }
          return acc;
        }, {});
        setEstudiantesAgrupados(Object.values(agrupados));
      } else {
        setEstudiantesAgrupados([]);
        alert("ℹ️ No hay alumnos registrados en este nivel.");
      }
    } finally {
      setCargando(false);
    }
  };

  const handleNotaChange = (idA: number, idM: number, u: string, v: string) => {
    setEstudiantesAgrupados((prev) =>
      prev.map((est) => {
        if (est.id_alumno === idA) {
          const up = (l: any[]) => l.map((m) => (m.id_materia === idM ? { ...m, [u]: v } : m));
          const newB = { ...est.bloques };
          Object.keys(newB).forEach((k) => (newB[k] = up(newB[k])));
          return { ...est, curriculares: up(est.curriculares || []), aspectos: up(est.aspectos || []), bloques: newB };
        }
        return est;
      }),
    );
  };

  const guardarNotasAlumno = async (idAlumno: number) => {
    const estudiante = estudiantesRef.current.find((e) => e.id_alumno === idAlumno);
    if (!estudiante) return;

    setAlumnosGuardando((prev) => [...prev, idAlumno]);

    try {
      const mats = [...(estudiante.curriculares || []), ...(estudiante.aspectos || [])];
      Object.values(estudiante.bloques).forEach((b: any) => mats.push(...b));
      const unicos = Array.from(new Map(mats.map((m) => [m.id_materia, m])).values());
      
      const esPerito = ["19", "20", "21"].includes(estudiante.id_grado.toString());
      let promedios = { u1: 0, u2: 0, u3: 0, u4: 0 };

      if (esPerito) {
        promedios = {
          u1: Number(calcularPromedioCombinado(estudiante.bloques[1] || [], estudiante.bloques[2] || [], "u1")),
          u2: Number(calcularPromedioCombinado(estudiante.bloques[1] || [], estudiante.bloques[2] || [], "u2")),
          u3: Number(calcularPromedioCombinado(estudiante.bloques[1] || [], estudiante.bloques[2] || [], "u3")),
          u4: Number(calcularPromedioCombinado(estudiante.bloques[1] || [], estudiante.bloques[2] || [], "u4")),
        };
      } else {
        const academicas = estudiante.bloques[1] || [];
        promedios = {
          u1: Number(calcularPromedioUnidad(academicas, "u1")),
          u2: Number(calcularPromedioUnidad(academicas, "u2")),
          u3: Number(calcularPromedioUnidad(academicas, "u3")),
          u4: Number(calcularPromedioUnidad(academicas, "u4")),
        };
      }

      const datosAEnviar: any[] = [];
      unicos.forEach((m: any) => {
        if (m.id_materia) {
          datosAEnviar.push({
            idEstudiante: estudiante.id_alumno, idMateria: m.id_materia,
            u1: m.u1 || "", u2: m.u2 || "", u3: m.u3 || "", u4: m.u4 || "",
          });
        }
      });

      datosAEnviar.push({
        idEstudiante: estudiante.id_alumno, idMateria: 500,
        u1: promedios.u1.toString(), u2: promedios.u2.toString(), u3: promedios.u3.toString(), u4: promedios.u4.toString(),
      });

      await guardarCalificacionesMasivas(datosAEnviar); 
    } catch (error) {
      console.error("Error guardando alumno", error);
    } finally {
      setAlumnosGuardando((prev) => prev.filter((id) => id !== idAlumno));
    }
  };

  const toggleAlumno = (idAlumno: number) => {
    if (expandidos.includes(idAlumno)) {
      guardarNotasAlumno(idAlumno);
      setExpandidos((prev) => prev.filter((i) => i !== idAlumno));
    } else {
      setExpandidos((prev) => [...prev, idAlumno]);
    }
  };

  useEffect(() => {
    if (expandidos.length === 0) return; 
    const interval = setInterval(() => {
      expandidos.forEach((id) => { guardarNotasAlumno(id); });
    }, INTERVALO_AUTOSAVE_MS);
    return () => clearInterval(interval); 
  }, [expandidos]);

  const toggleUnidad = (numUnidad: number) => {
    setUnidadesHabilitadas(prev => {
      if (prev.includes(numUnidad)) return prev.filter(u => u !== numUnidad);
      else return [...prev, numUnidad].sort((a, b) => a - b);
    });
  };

  const renderFilaMateria = (m: any, idA: number) => {
    const editable = puedeEditarMateria(m.id_materia);

    return (
      <tr key={m.id_materia} className={`transition-colors border-b border-gray-50 ${editable ? "hover:bg-red-50/40" : "bg-gray-50/50"}`}>
        <td className="px-10 py-4 text-left font-black text-[11px] uppercase text-gray-700">
          {m.materia}
          {!editable && (<span className="ml-2 text-[9px] text-red-500 bg-red-50 px-2 py-1 rounded-md tracking-wider hidden md:inline-block">BLOQUEADO</span>)}
        </td>
        {["u1", "u2", "u3", "u4"].map((u, idx) => {
          const numUnidad = idx + 1;
          const unidadActiva = unidadesHabilitadas.includes(numUnidad);
          const finalDisabled = !editable || !unidadActiva;
          const valorNota = parseFloat(m[u]);
          const estaReprobado = m.tipo === "Numerica" && !isNaN(valorNota) && valorNota < 69;

          return (
            <td key={u} className="px-1 md:px-3 py-4 text-center">
              {m.tipo === "Numerica" ? (
                <input type="number" value={m[u]} onChange={(e) => handleNotaChange(idA, m.id_materia, u, e.target.value)} disabled={finalDisabled} className={`w-[50px] md:w-[70px] h-[45px] border-2 rounded-xl text-center font-black outline-none transition-all ${finalDisabled ? "bg-gray-100/50 border-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-gray-200 focus:border-red-600"} ${estaReprobado ? "text-red-600 bg-red-50 border-red-200" : ""}`} />
              ) : (
                <select value={m[u]} onChange={(e) => handleNotaChange(idA, m.id_materia, u, e.target.value)} disabled={finalDisabled} className={`w-full md:w-[80px] h-[45px] border-2 rounded-xl text-[9px] md:text-[10px] font-black text-center outline-none transition-all ${finalDisabled ? "bg-gray-100/50 border-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-gray-200 focus:border-red-600"}`}>
                  <option value="">-</option>
                  {m.tipo === "Texto_Primaria" ? (<><option value="DESTACA">Destaca</option><option value="AVANZA">Avanza</option><option value="NM">NM</option></>) : (<><option value="F">F</option><option value="A">A</option><option value="NM">NM</option></>)}
                </select>
              )}
            </td>
          );
        })}
      </tr>
    );
  };

  const renderBoletaEspecifica = (estudiante: any, unidad: number) => {
    if (grado === "1") return <BoletaPreparatoria alumno={estudiante} unidadActual={unidad} seccion={seccion} anio={anioEscolar} />;
    if (grado === "4") return <BoletaPreKinder alumno={estudiante} unidadActual={unidad} seccion={seccion} anio={anioEscolar} />;
    if (grado === "5") return <BoletaKinder alumno={estudiante} unidadActual={unidad} seccion={seccion} anio={anioEscolar} />;
    if (["11", "12", "13"].includes(grado)) return <BoletaNursery alumno={estudiante} unidadActual={unidad} seccion={seccion} anio={anioEscolar} />;
    
    // 💡 1ro Primaria usa su propia boleta
    if (grado === "6") return <BoletaPrimeroPrimaria alumno={estudiante} unidadActual={unidad} seccion={seccion} anio={anioEscolar} />;
    
    // 💡 Los demás usan la General
    if (["7", "2", "8", "9", "10", "14", "15", "16", "17", "18", "19", "20", "21"].includes(grado)) {
      return <BoletaGeneral alumno={estudiante} unidadActual={unidad} seccion={seccion} anio={anioEscolar} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="bg-[#E60000] text-white shadow-lg p-4 md:p-6 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50 gap-4">
        <h1 className="text-lg md:text-xl font-black uppercase tracking-tight leading-none">Liceo Cristiano Zacapaneco</h1>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Link href="/notas" className="px-6 py-3 bg-white text-[#E60000] rounded-xl font-black text-xs uppercase shadow-md hover:bg-gray-100 transition-colors">Menú</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8 mb-6 flex flex-col md:flex-row items-end gap-4 md:gap-6">
          <div className="flex-1 w-full text-left">
            <label className="block text-gray-400 font-black mb-2 text-[10px] uppercase ml-1">Grado Académico</label>
            <select
              value={grado}
              onChange={(e) => {
                const nuevoGrado = e.target.value;
                setGrado(nuevoGrado);
                const obj = NIVELES.flatMap((n) => n.grados).find((g) => g.id === nuevoGrado);
                if (obj && obj.secciones.length > 0) setSeccion(obj.secciones[0].id); else setSeccion("");
                setEstudiantesAgrupados([]);
              }}
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none font-black text-sm uppercase text-gray-700"
            >
              <option value="">Seleccionar...</option>
              {NIVELES.map((nivel) => (
                <optgroup key={nivel.nivel} label={nivel.nivel.toUpperCase()}>
                  {nivel.grados.map((g) => {
                    if (puedeVerGrado(g.id)) return <option key={g.id} value={g.id}>{g.nombre}</option>; return null;
                  })}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="w-full md:w-48 text-left">
            <label className="block text-gray-400 font-black mb-2 text-[10px] uppercase ml-1">Sección</label>
            <select value={seccion} onChange={(e) => setSeccion(e.target.value)} disabled={!gradoSeleccionadoObj} className="w-full p-4 border-2 border-gray-100 rounded-2xl font-black text-sm bg-gray-50 disabled:opacity-50 outline-none text-gray-700">
              {!gradoSeleccionadoObj && <option value="">-</option>}
              {gradoSeleccionadoObj?.secciones.map((sec) => (
                <option key={sec.id} value={sec.id}>{sec.label === "Única" ? "Única" : `Sección ${sec.label}`}</option>
              ))}
            </select>
          </div>

          <button onClick={handleCargarAlumnos} disabled={cargando} className="w-full md:w-auto px-10 h-[58px] bg-[#17365D] text-white rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all uppercase text-xs">
            {cargando ? "Cargando..." : "Listar Alumnos"}
          </button>
        </div>

        {estudiantesAgrupados.length > 0 && (
          <div className="sticky top-[110px] md:top-[90px] z-40 mb-8 px-2">
            <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-sm rounded-3xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 ml-2 md:ml-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><span className="text-red-600 text-lg">📝</span></div>
                <div className="flex flex-col">
                  <span className="text-gray-400 font-black text-[9px] uppercase tracking-tighter">Planilla Digital</span>
                  <span className="text-gray-800 font-black text-sm uppercase">{estudiantesAgrupados.length} Alumnos en lista</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full md:w-auto gap-3 mr-2">
                {(permisos?.rol === "Admin" || permisos?.rol === "Super usuario") && (
                  <div className="flex gap-1 md:gap-2 mr-2 border-r border-gray-200 pr-2 md:pr-4 items-center">
                    <span className="text-[9px] font-black text-gray-400 hidden md:inline-block mr-2 uppercase tracking-tight">Imprimir Todos:</span>
                    {unidadesHabilitadas.map((u) => (
                      <button key={u} onClick={() => handleImpresionMasiva(u)} title={`Imprimir Unidad ${u} de toda la sección`} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-[#E60000] hover:text-white rounded-lg font-black text-xs transition-colors shadow-sm text-gray-500">
                        {u}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2 bg-slate-50 text-slate-500 px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline-block">Autoguardado Activo</span>
                  <span className="text-[10px] font-black uppercase tracking-wider sm:hidden">Guardando</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {estudiantesAgrupados.map((est, index) => {
          const estaAbierto = expandidos.includes(est.id_alumno);
          const estaGuardandoEsteAlumno = alumnosGuardando.includes(est.id_alumno);
          const esPreVisual = ["11", "12", "13", "4", "5", "1"].includes(est.id_grado.toString());

          return (
            <div key={index} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div onClick={() => toggleAlumno(est.id_alumno)} className="bg-white border-b border-gray-50 hover:bg-gray-50 p-4 md:p-6 flex justify-between items-center cursor-pointer transition-colors">
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#E60000] text-white flex items-center justify-center font-black text-xs md:text-sm uppercase shadow-sm">{est.nombre.substring(0, 2)}</div>
                  <h4 className="font-black text-gray-800 text-sm md:text-lg uppercase tracking-tight">{est.nombre}</h4>
                </div>
                <div className="flex items-center gap-4">
                  {estaGuardandoEsteAlumno && <span className="text-[10px] font-black text-red-500 animate-pulse uppercase tracking-widest bg-red-50 px-3 py-1 rounded-lg border border-red-100 shadow-sm">Guardando...</span>}
                  <div className={`w-8 h-8 rounded-full bg-gray-50 shadow-sm flex items-center justify-center text-gray-500 transition-transform duration-300 ${estaAbierto ? "rotate-180" : ""}`}>
                    <span className="font-black text-xs">▼</span>
                  </div>
                </div>
              </div>

              {estaAbierto && (
                <div className="p-2 md:p-4 overflow-x-auto bg-white">
                  {(permisos?.rol === "Admin" || permisos?.rol === "Super usuario") && (
                    <div className="flex justify-end gap-2 mb-4 flex-wrap">
                      {unidadesHabilitadas.map((unidad) => {
                        const romanos = ["I", "II", "III", "IV"];
                        return (
                          <button key={unidad} onClick={() => { setUnidadAImprimir(unidad); setAlumnoParaImprimir(est); setTimeout(() => handlePrint(), 300); }} className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm flex items-center gap-2">
                            <span>🖨️</span> {romanos[unidad - 1]} UNIDAD
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-black tracking-widest text-center border-b border-gray-100">
                      <tr>
                        <th className="px-4 md:px-10 py-4 text-left w-[40%] md:w-1/2">Materia</th>
                        <th className={`py-4 ${unidadesHabilitadas.includes(1) ? 'text-gray-800' : 'opacity-30'}`}>U I</th>
                        <th className={`py-4 ${unidadesHabilitadas.includes(2) ? 'text-gray-800' : 'opacity-30'}`}>U II</th>
                        <th className={`py-4 ${unidadesHabilitadas.includes(3) ? 'text-gray-800' : 'opacity-30'}`}>U III</th>
                        <th className={`py-4 ${unidadesHabilitadas.includes(4) ? 'text-gray-800' : 'opacity-30'}`}>U IV</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {esPreVisual ? (
                        <>
                          <tr className="bg-red-50/30 text-left"><td colSpan={5} className="px-4 md:px-10 py-4 font-black text-red-700 uppercase text-[10px] tracking-widest">Áreas Curriculares</td></tr>
                          {est.curriculares.map((m: any) => renderFilaMateria(m, est.id_alumno))}
                          <tr className="bg-yellow-50/30 text-left border-t-4 border-white"><td colSpan={5} className="px-4 md:px-10 py-4 font-black text-yellow-700 uppercase text-[10px] tracking-widest">Aspectos</td></tr>
                          {est.aspectos.map((m: any) => renderFilaMateria(m, est.id_alumno))}
                        </>
                      ) : (
                        (() => {
                          const esPrimaria = ["6", "7", "2", "8", "9", "10"].includes(est.id_grado.toString());
                          const esBasico = ["14", "15", "16"].includes(est.id_grado.toString());
                          const esBachillerato = ["17", "18"].includes(est.id_grado.toString());
                          const esPerito = ["19", "20", "21"].includes(est.id_grado.toString());
                          
                          let areasRender: { id: number; titulo: string }[] = [];
                          if (esPrimaria) areasRender = areasPrimaria;
                          else if (esBasico) areasRender = areasBasico;
                          else if (esBachillerato) areasRender = areasBachillerato;
                          else if (esPerito) areasRender = areasPerito;

                          return areasRender.map((area) =>
                            est.bloques[area.id] && est.bloques[area.id].length > 0 && (
                              <React.Fragment key={area.id}>
                                <tr><td colSpan={5} className="px-4 md:px-10 py-4 font-black text-gray-700 uppercase text-[10px] bg-gray-50/50 text-left tracking-widest border-t-4 border-white">{area.titulo}</td></tr>
                                {est.bloques[area.id].map((m: any) => renderFilaMateria(m, est.id_alumno))}
                                
                                {(!esPerito && area.id === 1) && (
                                  <tr className="bg-red-50/50 font-black text-[#E60000] border-t-2 border-red-100">
                                    <td className="px-4 md:px-10 py-4 text-right text-[10px] uppercase tracking-widest">Promedio Exacto</td>
                                    <td className="text-center py-4 text-sm">{calcularPromedioUnidad(est.bloques[area.id], "u1")}</td>
                                    <td className="text-center py-4 text-sm">{calcularPromedioUnidad(est.bloques[area.id], "u2")}</td>
                                    <td className="text-center py-4 text-sm">{calcularPromedioUnidad(est.bloques[area.id], "u3")}</td>
                                    <td className="text-center py-4 text-sm">{calcularPromedioUnidad(est.bloques[area.id], "u4")}</td>
                                  </tr>
                                )}

                                {(esPerito && area.id === 2) && (
                                  <tr className="bg-red-50/50 font-black text-[#E60000] border-t-2 border-red-100">
                                    <td className="px-4 md:px-10 py-4 text-right text-[10px] uppercase tracking-widest">Promedio Exacto</td>
                                    <td className="text-center py-4 text-sm">{calcularPromedioCombinado(est.bloques[1] || [], est.bloques[2] || [], "u1")}</td>
                                    <td className="text-center py-4 text-sm">{calcularPromedioCombinado(est.bloques[1] || [], est.bloques[2] || [], "u2")}</td>
                                    <td className="text-center py-4 text-sm">{calcularPromedioCombinado(est.bloques[1] || [], est.bloques[2] || [], "u3")}</td>
                                    <td className="text-center py-4 text-sm">{calcularPromedioCombinado(est.bloques[1] || [], est.bloques[2] || [], "u4")}</td>
                                  </tr>
                                )}
                              </React.Fragment>
                            )
                          )
                        })()
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </main>

      <div style={{ display: "none" }}>
        <div ref={componentRef} className="print-container">
          {imprimiendoMasivo ? (
            estudiantesAgrupados.map((est, i) => (
              <div key={i} style={{ pageBreakAfter: "always" }}>
                {renderBoletaEspecifica(est, unidadAImprimir)}
              </div>
            ))
          ) : (
            alumnoParaImprimir && renderBoletaEspecifica(alumnoParaImprimir, unidadAImprimir)
          )}
        </div>
      </div>
    </div>
  );
}