/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * This server component loads static wallet data from a JSON file and passes it
 * to the TransferUI client component. This replaces getStaticProps from Pages Router.
 */

import fs from 'fs';
import path from 'path';
import convertSections from '../../lib/convertSections';
import sectionMeta from '../../../shared/section-metadata.json';
import TransferUI from './TransferUI';

export default async function TestTransferPage() {
  const dataPath = path.join(process.cwd(), '../data/sample-wallets.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const parsed = JSON.parse(rawData);
  const rawSections = convertSections(parsed);

  return <TransferUI rawSections={rawSections} />;
}

