export type Constructor<T = any> = new (...args: any[]) => T;

export abstract class BaseContext<T = any> {

	public contents = [];

	public abstract get contentName() : string;

	public create<T2 extends T>(clazz: Constructor<T2>, value: T2) {
		const ori = this.find(clazz);
		if (!ori) this.contents.push({clazz, value});
		else ori.value = value;

		console.error(`[${this.contentName} ADD]`, {clazz, value});
	}
	public remove<T2 extends T>(clazz: Constructor<T2>) {
		const ori = this.find(clazz);
		if (ori) ori.value = null;

		console.log(`[${this.contentName} REMOVE]`, {clazz});
	}
	public instance<T2 extends T>(clazz: Constructor<T2>) : T2 {
		if (!clazz) return null;

		const res = this.find(clazz)?.value;
		if (!res) console.error(`[${this.contentName} GET MISS]`, {clazz, res});

		return res;
	}

	private find<T2 extends T>(clazz: Constructor<T2>):
		{clazz: Constructor<T2>, value: T2} {
		return this.contents.find(s => s.clazz == clazz);
	}

}
