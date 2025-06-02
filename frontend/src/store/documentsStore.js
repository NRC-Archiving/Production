import { defineStore } from "pinia";

export const useDocumentsListStore = defineStore('documents-list', {
  state: () => {
    return {
      allDocs: true,
      docCategory: 0,
      docFilter: {
        docType: '',
        docStatus: '',
        startDate: '',
        endDate: '',
        keyword: ''
      },
      currentPage: 1,
      limit: 10,
      totalPages: 0,
      totalDocuments: 0,
      docs: []
    }
  },
  getters: {
    docCategorys: (state) => {
      const docType = state.docFilter.docType;
      if (docType == 'A01' ||
        docType == 'A02' ||
        docType == 'A03' ||
        docType == 'A04' ||
        docType == 'A05' ||
        docType == 'A06' ||
        docType == 'A07' ||
        docType == 'A08' ||
        docType == 'A09' ||
        docType == 'A10') {
        return 1;
      } else if (docType == 'B01' || docType == 'B02') {
        return 2;
      } else if (docType == 'C01' || docType == 'C02') {
        return 3;
      } else {
        return 0;
      }
    }
  },
  persist: {
    storage: sessionStorage
  }
});

export const useDocumentListSchemaStore = defineStore('document-list-schema', {
  state: () => {
    return {
      schema: {}
    }
  }
})