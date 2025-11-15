export interface Stats {
  label: string;
  value: string | number;
  change?: number;
  icon: any;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface Parcelle {
  id: string;
  name: string;
  surface: number;
  culture: string;
  status: 'EN_PREPARATION' | 'SEMIS' | 'CROISSANCE' | 'RECOLTE';
  paysan: {
    firstName: string;
    lastName: string;
  };
  investissements?: {
    montant: number;
  }[];
}

export interface Investment {
  id: string;
  montant: number;
  dateInvestissement: string;
  status: 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE';
  parcelle: {
    name: string;
    culture: string;
    paysan: {
      firstName: string;
      lastName: string;
    };
  };
}
