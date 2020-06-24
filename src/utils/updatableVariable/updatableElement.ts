export default class UpdatableElement<VarType> {
   private isUpdated: boolean = false;
   private value: VarType;


   public constructor(initValue: VarType, isUpdated?: boolean) {
      this.value = initValue;
      this.isUpdated = !!isUpdated;
   }


   public get ChangedValue(): VarType | undefined {
      return this.isUpdated ? this.value : undefined;
   }


   public get IsUpdated(): boolean {
      return this.isUpdated;
   };

   public ResetIsUpdated(): void {
      this.isUpdated = false;
   };


   public get Value(): VarType {
      return this.value;
   };

   public set Value(newValue: VarType) {
      this.isUpdated = true;
      this.value = newValue;
   }
}
