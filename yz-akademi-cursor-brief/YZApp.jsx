import React, { useState, useEffect, useMemo } from 'react';
import {
  Home, BookOpen, Trophy, User, Flame, Zap, Star, Lock,
  Brain, Cpu, Shield, ChevronRight, ChevronLeft, Check, X,
  Highlighter, StickyNote, Clock, Target, Award, TrendingUp,
  Play, RotateCcw, ArrowRight, Sparkles
} from 'lucide-react';

// ============ İÇERİK VERİSİ ============
const CHAPTERS = [
  {
    id: 1, title: 'YZ Temelleri', icon: Brain, color: 'purple',
    minutes: 25, progress: 100,
    sections: [
      { title: '1.1 Yapay Zeka Nedir?', text: 'Yapay zeka, insan zekasını taklit eden ve verilerden öğrenen sistemlerdir. 1956\'da Dartmouth Konferansı\'nda doğan terim, bugün hayatımızın her yerinde.' },
      { title: '1.2 YZ Tarihçesi', text: 'Alan Turing\'in 1950 tarihli "Computing Machinery and Intelligence" makalesi yapay zekanın felsefi temelini attı. AI Winter dönemleri ve canlanışlar...' }
    ]
  },
  {
    id: 2, title: 'Makine Öğrenmesi', icon: Cpu, color: 'teal',
    minutes: 30, progress: 100,
    sections: [
      { title: '2.1 ML Türleri', text: 'Denetimli, denetimsiz ve pekiştirmeli öğrenme olmak üzere üç ana paradigma vardır.' }
    ]
  },
  {
    id: 3, title: 'Derin Öğrenme', icon: Zap, color: 'amber',
    minutes: 35, progress: 80,
    sections: [
      { title: '3.1 Sinir Ağları', text: 'Yapay sinir ağları, biyolojik nöronlardan ilham alır. Katmanlar, ağırlıklar, aktivasyon fonksiyonları...' }
    ]
  },
  {
    id: 4, title: 'LLM\