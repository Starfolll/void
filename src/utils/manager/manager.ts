export default abstract class Manager<Configs> {
   protected readonly configs: Configs;


   protected constructor(configs: Configs) {
      this.configs = configs;
   }


   public async abstract Setup(...args: any[]): Promise<void>;

   public async abstract Boot(...args: any[]): Promise<void>;
}
