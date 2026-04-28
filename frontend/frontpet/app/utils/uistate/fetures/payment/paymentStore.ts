import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DataType {
  domainUrl?: string;
}

interface PaymentMode {
  payment: "payment";
  subscription: "subscription";
}

export interface PaymentState {
  clientSecret: any;
  currentStep: number;
  isModalVisible: boolean;
  data: DataType | null;
  triggerRegistration: boolean;
  amount: number;
  currency: string;
  mode: keyof PaymentMode;
  formData: {
    companyName: string;
    domainName: string;
    companyEmail: string;
    phoneNumber: string;
    industry: string;
    businessSize: string;
    contactPersonName: string;
    contactPersonEmail: string;
    contactPersonPhoneNumber: string;
    paymentPersonName: string;
    paymentPersonEmail: string;
    paymentPersonPhoneNumber: string;
    country: string;
    region: string;
    subscriptionType: string;
    billingPeriod: string;
    paymentCurrency?: string;
    employeeNumber: number;
  };
  setCurrentStep: (step: number) => void;
  setIsModalVisible: (visible: boolean) => void;
  setData: (data: DataType | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  setMode: (mode: keyof PaymentMode) => void;
  setAmount: (amount: number) => void;
  setTriggerRegistration: (value: boolean) => void;
  setFormData: (data: Partial<PaymentState["formData"]>) => void;
  setSubscriptionType: (value: string) => void;
  setClientSecret: (secret: any) => void;

  progress: number;
  setProgress: (updater: number | ((prev: number) => number)) => void;
  isProgressVisible: boolean;
  setIsProgressVisible: (value: boolean) => void;

  resetStore: () => void;
}

const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      currentStep: 0,
      amount: 1,
      currency: "usd",
      mode: "payment",
      isModalVisible: false,
      data: null,
      triggerRegistration: false,
      clientSecret: null,
      formData: {
        companyName: "",
        domainName: "",
        companyEmail: "",
        phoneNumber: "",
        industry: "",
        businessSize: "",
        contactPersonName: "",
        contactPersonEmail: "",
        contactPersonPhoneNumber: "",
        paymentPersonName: "",
        paymentPersonEmail: "",
        paymentPersonPhoneNumber: "",
        country: "",
        region: "",
        subscriptionType: "",
        billingPeriod: "",
        paymentCurrency: "",
        employeeNumber: 0,
      },

      setAmount: (value) => set({ amount: value }),
      setClientSecret: (secret: any) => set({ clientSecret: secret }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setIsModalVisible: (visible) => set({ isModalVisible: visible }),
      setData: (data) => set({ data }),

      resetStore: () => {
        set({
          currentStep: 0,
          isModalVisible: false,
          formData: {
            companyName: "",
            domainName: "",
            companyEmail: "",
            phoneNumber: "",
            industry: "",
            businessSize: "",
            contactPersonName: "",
            contactPersonEmail: "",
            contactPersonPhoneNumber: "",
            paymentPersonName: "",
            paymentPersonEmail: "",
            paymentPersonPhoneNumber: "",
            country: "",
            region: "",
            subscriptionType: "",
            billingPeriod: "",
            paymentCurrency: "",
            employeeNumber: 0,
          },
          amount: 1,
          clientSecret: null,
        });
        localStorage.removeItem("payment-storage");
      },

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () =>
        set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

      setMode: (mode) => set({ mode }),
      setTriggerRegistration: (value) => set({ triggerRegistration: value }),

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setSubscriptionType: (subscriptionType) =>
        set((state) => ({
          formData: { ...state.formData, subscriptionType },
        })),

      progress: 0,
      setProgress: (updater) =>
        set((state) => ({
          progress:
            typeof updater === "function" ? updater(state.progress) : updater,
        })),

      setIsProgressVisible: (isProgressVisible) => set({ isProgressVisible }),
      isProgressVisible: false,
    }),

    {
      name: "payment-storage",
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
      partialize: (state: PaymentState) => {
        const {
          currentStep,
          formData,
          amount,
          mode,
          clientSecret,
          isModalVisible,
          data,
          triggerRegistration,
          currency,
          progress,
          isProgressVisible,
        } = state;
        return {
          currentStep,
          formData,
          amount,
          mode,
          clientSecret,
          isModalVisible,
          data,
          triggerRegistration,
          currency,
          progress,
          isProgressVisible,
        };
      },
    }
  )
);

export default usePaymentStore;
