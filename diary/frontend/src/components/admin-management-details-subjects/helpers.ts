export const splittingLastName = (last_name: string) => {
    return last_name.split(' ').map(word => word[0]).join('.') + "."
}