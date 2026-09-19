'use client';

import React from 'react';
import { DemoBlock } from '@/components';
import { Head, Section } from '../Chrome';
import { DeployRun } from '../game/DeployRun';

/**
 * One demo, and it is real. Placeholder frames that promised a 3D configurator and a
 * second game were removed: an unplayable demo on a page about doing the work is worse than none
 */
export function Demos() {
  return (
    <Section id="demos" pad={160}>
      <Head
        index="01"
        title="Не рассказываем, что умеем. Показываем"
        lead="Ниже работает Deploy Run — механика, собранная для этого сайта. Тот же технологический уровень, который мы собираем для клиентских проектов. Что она стоила и сколько заняла, видно в проекте ниже"
      />
      <DemoBlock
        dark
        ratio="21/9"
        title="Deploy Run — тридцать секунд на попадание в окно деплоя"
        meta="Canvas · лидерборд"
        cta="Запустить игру"
        loadingText="Готовим поле"
      >
        <DeployRun />
      </DemoBlock>
    </Section>
  );
}
